# 📱 ProSporte - Integração Android

## 🎯 Objetivo

Conectar o App Android ao Backend Hub (`/api/v1/sync`) para consumir dados normalizados de partidas de futebol.

---

## 📋 Padrão de Dados

Toda partida do backend segue este padrão:

```json
{
  "id_partida": "1001",
  "casa": "Real Madrid",
  "fora": "Barcelona",
  "placar_casa": 0,
  "placar_fora": 0,
  "status": "15:30",
  "liga": "La Liga",
  "data_partida": "2026-01-31T15:30:00Z",
  "timestamp_sync": "2026-01-31T14:30:00Z"
}
```

---

## 🔧 Setup do Retrofit

### 1. Adicionar Dependências (build.gradle)

```gradle
dependencies {
    // Retrofit + Gson
    implementation 'com.squareup.retrofit2:retrofit:2.9.0'
    implementation 'com.squareup.retrofit2:converter-gson:2.9.0'
    implementation 'com.google.code.gson:gson:2.10.1'
    
    // OkHttp (opcional mas recomendado)
    implementation 'com.squareup.okhttp3:okhttp:4.10.0'
    implementation 'com.squareup.okhttp3:logging-interceptor:4.10.0'
    
    // Coroutines
    implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-android:1.6.4'
    implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core:1.6.4'
    
    // ViewModel + LiveData
    implementation 'androidx.lifecycle:lifecycle-viewmodel-ktx:2.5.1'
    implementation 'androidx.lifecycle:lifecycle-livedata-ktx:2.5.1'
}
```

### 2. Adicionar Internet Permission (AndroidManifest.xml)

```xml
<uses-permission android:name="android.permission.INTERNET" />
```

---

## 📊 Data Models

### Passo 1: Criar Data Classes

Arquivo: `com/prosporte/data/models/SyncModels.kt`

```kotlin
package com.prosporte.data.models

import com.google.gson.annotations.SerializedName

/**
 * Resposta completa do /api/v1/sync
 */
data class SyncResponse(
    @SerializedName("success")
    val success: Boolean,
    @SerializedName("timestamp")
    val timestamp: String,
    @SerializedName("metadata")
    val metadata: SyncMetadata,
    @SerializedName("matches")
    val matches: List<Partida>,
    @SerializedName("totalMatches")
    val totalMatches: Int
)

/**
 * Metadados da sincronização
 */
data class SyncMetadata(
    @SerializedName("version")
    val version: String,
    @SerializedName("provider")
    val provider: String,
    @SerializedName("lastSync")
    val lastSync: String,
    @SerializedName("totalMatches")
    val totalMatches: Int,
    @SerializedName("status")
    val status: String
)

/**
 * Modelo de Partida
 * NUNCA modifique os nomes dos campos - devem coincidir com JSON do backend
 */
data class Partida(
    @SerializedName("id_partida")
    val idPartida: String,
    
    @SerializedName("casa")
    val casa: String,
    
    @SerializedName("fora")
    val fora: String,
    
    @SerializedName("placar_casa")
    val placarCasa: Int,
    
    @SerializedName("placar_fora")
    val placarFora: Int,
    
    @SerializedName("status")
    val status: String,
    
    @SerializedName("liga")
    val liga: String,
    
    @SerializedName("data_partida")
    val dataPartida: String,
    
    @SerializedName("timestamp_sync")
    val timestampSync: String
) {
    // Helper: retorna "Casa X Fora"
    val nomePartida: String
        get() = "$casa × $fora"
    
    // Helper: retorna "Placar Casa Placar Fora"
    val placarFormatado: String
        get() = "$placarCasa × $placarFora"
    
    // Helper: verifica se partida iniciou
    val jaComecou: Boolean
        get() = status == "Finalizado" || 
                status == "Ao Vivo" || 
                status == "Intervalo" ||
                !status.matches(Regex("\\d{2}:\\d{2}"))
}

/**
 * Resposta para /api/v1/sync/matches com filtros
 */
data class FilteredSyncResponse(
    @SerializedName("success")
    val success: Boolean,
    @SerializedName("timestamp")
    val timestamp: String,
    @SerializedName("filters")
    val filters: FilterInfo,
    @SerializedName("totalMatches")
    val totalMatches: Int,
    @SerializedName("matches")
    val matches: List<Partida>
)

/**
 * Informações dos filtros aplicados
 */
data class FilterInfo(
    @SerializedName("status")
    val status: String,
    @SerializedName("liga")
    val liga: String
)

/**
 * Resposta de status
 */
data class SyncStatusResponse(
    @SerializedName("success")
    val success: Boolean,
    @SerializedName("timestamp")
    val timestamp: String,
    @SerializedName("status")
    val status: SyncStatusInfo,
    @SerializedName("history")
    val history: List<SyncLog>
)

data class SyncStatusInfo(
    @SerializedName("lastSync")
    val lastSync: String,
    @SerializedName("provider")
    val provider: String,
    @SerializedName("totalMatches")
    val totalMatches: Int,
    @SerializedName("dataStatus")
    val dataStatus: String
)

data class SyncLog(
    @SerializedName("provider")
    val provider: String,
    @SerializedName("timestamp")
    val timestamp: String,
    @SerializedName("status")
    val status: String,
    @SerializedName("matchesCount")
    val matchesCount: Int,
    @SerializedName("duration")
    val duration: Long
)
```

---

## 🌐 Retrofit Service

Arquivo: `com/prosporte/data/api/ProSporteService.kt`

```kotlin
package com.prosporte.data.api

import com.prosporte.data.models.*
import retrofit2.Response
import retrofit2.http.GET
import retrofit2.http.Query

/**
 * Interface Retrofit para ProSporte Backend
 */
interface ProSporteService {
    
    /**
     * GET /api/v1/sync
     * Retorna todas as partidas normalizadas
     */
    @GET("api/v1/sync")
    suspend fun getAllMatches(): Response<SyncResponse>
    
    /**
     * GET /api/v1/sync/matches
     * Retorna partidas com filtros opcionais
     * @param liga Filtrar por liga (ex: "La Liga", "Premier League")
     * @param status Filtrar por status (ex: "Ao Vivo", "Finalizado")
     */
    @GET("api/v1/sync/matches")
    suspend fun getMatches(
        @Query("liga") liga: String? = null,
        @Query("status") status: String? = null
    ): Response<FilteredSyncResponse>
    
    /**
     * GET /api/v1/sync/status
     * Retorna status e histórico de sincronizações
     */
    @GET("api/v1/sync/status")
    suspend fun getSyncStatus(): Response<SyncStatusResponse>
}
```

---

## 🛠️ Retrofit Client Builder

Arquivo: `com/prosporte/data/api/RetrofitClient.kt`

```kotlin
package com.prosporte.data.api

import com.google.gson.GsonBuilder
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit

/**
 * Singleton do Retrofit Client
 */
object RetrofitClient {
    
    // URL do Backend Hub
    private const val BASE_URL = "http://10.0.2.2:3000/"  // Android Emulator
    // Para device real: "http://192.168.X.X:3000/" (IP da máquina)
    
    // Timeout configs
    private const val CONNECT_TIMEOUT = 30L
    private const val READ_TIMEOUT = 30L
    private const val WRITE_TIMEOUT = 30L
    
    private var service: ProSporteService? = null
    
    /**
     * Retorna instância do serviço Retrofit
     */
    fun getService(): ProSporteService {
        if (service == null) {
            service = createRetrofit().create(ProSporteService::class.java)
        }
        return service!!
    }
    
    /**
     * Constrói a instância Retrofit
     */
    private fun createRetrofit(): Retrofit {
        val httpClient = OkHttpClient.Builder()
            .connectTimeout(CONNECT_TIMEOUT, TimeUnit.SECONDS)
            .readTimeout(READ_TIMEOUT, TimeUnit.SECONDS)
            .writeTimeout(WRITE_TIMEOUT, TimeUnit.SECONDS)
            .addInterceptor(loggingInterceptor())
            .build()
        
        val gson = GsonBuilder()
            .setLenient()
            .create()
        
        return Retrofit.Builder()
            .baseUrl(BASE_URL)
            .client(httpClient)
            .addConverterFactory(GsonConverterFactory.create(gson))
            .build()
    }
    
    /**
     * Interceptor para logging (apenas em debug)
     */
    private fun loggingInterceptor(): HttpLoggingInterceptor {
        return HttpLoggingInterceptor().apply {
            level = HttpLoggingInterceptor.Level.BODY
        }
    }
}
```

---

## 🏗️ Repository Pattern

Arquivo: `com/prosporte/data/repository/SyncRepository.kt`

```kotlin
package com.prosporte.data.repository

import com.prosporte.data.api.RetrofitClient
import com.prosporte.data.models.*

/**
 * Repository para centralizar requisições ao Backend
 */
class SyncRepository {
    
    private val service = RetrofitClient.getService()
    
    /**
     * Busca todas as partidas
     */
    suspend fun getAllMatches(): Result<SyncResponse> {
        return try {
            val response = service.getAllMatches()
            if (response.isSuccessful) {
                Result.success(response.body()!!)
            } else {
                Result.failure(Exception("Erro: ${response.code()}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    /**
     * Busca partidas com filtros
     */
    suspend fun getMatches(
        liga: String? = null,
        status: String? = null
    ): Result<FilteredSyncResponse> {
        return try {
            val response = service.getMatches(liga, status)
            if (response.isSuccessful) {
                Result.success(response.body()!!)
            } else {
                Result.failure(Exception("Erro: ${response.code()}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    /**
     * Busca status de sincronização
     */
    suspend fun getSyncStatus(): Result<SyncStatusResponse> {
        return try {
            val response = service.getSyncStatus()
            if (response.isSuccessful) {
                Result.success(response.body()!!)
            } else {
                Result.failure(Exception("Erro: ${response.code()}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
```

---

## 📲 ViewModel

Arquivo: `com/prosporte/ui/viewmodels/MatchesViewModel.kt`

```kotlin
package com.prosporte.ui.viewmodels

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.prosporte.data.models.Partida
import com.prosporte.data.repository.SyncRepository
import kotlinx.coroutines.launch

/**
 * ViewModel para gerenciar estado das partidas
 */
class MatchesViewModel : ViewModel() {
    
    private val repository = SyncRepository()
    
    // LiveData publico (imutável)
    private val _matches = MutableLiveData<List<Partida>>()
    val matches: LiveData<List<Partida>> = _matches
    
    private val _isLoading = MutableLiveData<Boolean>()
    val isLoading: LiveData<Boolean> = _isLoading
    
    private val _error = MutableLiveData<String?>()
    val error: LiveData<String?> = _error
    
    private val _totalMatches = MutableLiveData<Int>()
    val totalMatches: LiveData<Int> = _totalMatches
    
    /**
     * Carrega todas as partidas
     */
    fun loadMatches() {
        _isLoading.value = true
        viewModelScope.launch {
            repository.getAllMatches().onSuccess { response ->
                _matches.value = response.matches
                _totalMatches.value = response.totalMatches
                _error.value = null
                _isLoading.value = false
            }.onFailure { exception ->
                _error.value = exception.message
                _isLoading.value = false
            }
        }
    }
    
    /**
     * Carrega partidas com filtros
     */
    fun loadMatchesFiltered(liga: String? = null, status: String? = null) {
        _isLoading.value = true
        viewModelScope.launch {
            repository.getMatches(liga, status).onSuccess { response ->
                _matches.value = response.matches
                _totalMatches.value = response.totalMatches
                _error.value = null
                _isLoading.value = false
            }.onFailure { exception ->
                _error.value = exception.message
                _isLoading.value = false
            }
        }
    }
    
    /**
     * Limpa o erro
     */
    fun clearError() {
        _error.value = null
    }
}
```

---

## 🎨 Activity/Fragment de Exemplo

Arquivo: `com/prosporte/ui/activities/MatchesActivity.kt`

```kotlin
package com.prosporte.ui.activities

import android.os.Bundle
import android.widget.ProgressBar
import android.widget.Toast
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.prosporte.R
import com.prosporte.ui.adapters.PartidaAdapter
import com.prosporte.ui.viewmodels.MatchesViewModel

class MatchesActivity : AppCompatActivity() {
    
    private val viewModel: MatchesViewModel by viewModels()
    private lateinit var recyclerView: RecyclerView
    private lateinit var progressBar: ProgressBar
    private lateinit var adapter: PartidaAdapter
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_matches)
        
        setupUI()
        setupObservers()
        
        // Carrega partidas ao abrir
        viewModel.loadMatches()
    }
    
    private fun setupUI() {
        recyclerView = findViewById(R.id.recyclerView)
        progressBar = findViewById(R.id.progressBar)
        
        adapter = PartidaAdapter()
        recyclerView.apply {
            layoutManager = LinearLayoutManager(this@MatchesActivity)
            adapter = this@MatchesActivity.adapter
        }
    }
    
    private fun setupObservers() {
        // Observa partidas
        viewModel.matches.observe(this) { partidas ->
            adapter.submitList(partidas)
        }
        
        // Observa loading
        viewModel.isLoading.observe(this) { isLoading ->
            progressBar.visibility = if (isLoading) {
                android.view.View.VISIBLE
            } else {
                android.view.View.GONE
            }
        }
        
        // Observa erros
        viewModel.error.observe(this) { error ->
            if (error != null) {
                Toast.makeText(this, "Erro: $error", Toast.LENGTH_SHORT).show()
                viewModel.clearError()
            }
        }
        
        // Observa total de partidas
        viewModel.totalMatches.observe(this) { total ->
            title = "Partidas ($total)"
        }
    }
}
```

---

## 📋 RecyclerView Adapter

Arquivo: `com/prosporte/ui/adapters/PartidaAdapter.kt`

```kotlin
package com.prosporte.ui.adapters

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.prosporte.R
import com.prosporte.data.models.Partida

class PartidaAdapter : ListAdapter<Partida, PartidaAdapter.PartidaViewHolder>(DiffCallback()) {
    
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): PartidaViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_partida, parent, false)
        return PartidaViewHolder(view)
    }
    
    override fun onBindViewHolder(holder: PartidaViewHolder, position: Int) {
        holder.bind(getItem(position))
    }
    
    class PartidaViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        private val tvCasa: TextView = itemView.findViewById(R.id.tvCasa)
        private val tvPlacar: TextView = itemView.findViewById(R.id.tvPlacar)
        private val tvFora: TextView = itemView.findViewById(R.id.tvFora)
        private val tvStatus: TextView = itemView.findViewById(R.id.tvStatus)
        private val tvLiga: TextView = itemView.findViewById(R.id.tvLiga)
        
        fun bind(partida: Partida) {
            tvCasa.text = partida.casa
            tvPlacar.text = partida.placarFormatado
            tvFora.text = partida.fora
            tvStatus.text = partida.status
            tvLiga.text = partida.liga
        }
    }
    
    class DiffCallback : DiffUtil.ItemCallback<Partida>() {
        override fun areItemsTheSame(oldItem: Partida, newItem: Partida) =
            oldItem.idPartida == newItem.idPartida
        
        override fun areContentsTheSame(oldItem: Partida, newItem: Partida) =
            oldItem == newItem
    }
}
```

---

## 🎨 Layout XML

Arquivo: `res/layout/item_partida.xml`

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:orientation="vertical"
    android:padding="16dp"
    android:background="@drawable/bg_partida_card">
    
    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:orientation="horizontal"
        android:gravity="center_vertical">
        
        <TextView
            android:id="@+id/tvCasa"
            android:layout_width="0dp"
            android:layout_height="wrap_content"
            android:layout_weight="1"
            android:text="Time Casa"
            android:textSize="16sp"
            android:textStyle="bold" />
        
        <TextView
            android:id="@+id/tvPlacar"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="0 × 0"
            android:textSize="18sp"
            android:textStyle="bold"
            android:layout_marginHorizontal="16dp" />
        
        <TextView
            android:id="@+id/tvFora"
            android:layout_width="0dp"
            android:layout_height="wrap_content"
            android:layout_weight="1"
            android:text="Time Fora"
            android:textSize="16sp"
            android:textStyle="bold"
            android:gravity="end" />
    </LinearLayout>
    
    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:orientation="horizontal"
        android:layout_marginTop="8dp">
        
        <TextView
            android:id="@+id/tvStatus"
            android:layout_width="0dp"
            android:layout_height="wrap_content"
            android:layout_weight="1"
            android:text="15:30"
            android:textSize="12sp"
            android:textColor="@color/status" />
        
        <TextView
            android:id="@+id/tvLiga"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="La Liga"
            android:textSize="12sp"
            android:textColor="@color/liga" />
    </LinearLayout>
</LinearLayout>
```

---

## 🔗 Configuração da URL

### Para Emulador Android:
```kotlin
private const val BASE_URL = "http://10.0.2.2:3000/"
```

### Para Device Real:
1. Identifique o IP da máquina (onde o server está rodando):
   ```bash
   ipconfig  // Windows
   ifconfig  // Mac/Linux
   ```
   
2. Substitua em `RetrofitClient.kt`:
   ```kotlin
   private const val BASE_URL = "http://192.168.X.X:3000/"  // X.X = seu IP
   ```

3. Certifique-se de que o device está na mesma rede

---

## ✅ Checklist de Integração

- [ ] Data models criados
- [ ] Retrofit service implementado
- [ ] Repository implementado
- [ ] ViewModel implementado
- [ ] Adapter implementado
- [ ] Layout XML criado
- [ ] Activity/Fragment criado
- [ ] URL configurada para emulador/device
- [ ] Internet permission no AndroidManifest
- [ ] Dependências Gradle instaladas
- [ ] App executa sem erros

---

## 🧪 Teste Rápido

1. Inicie o Backend:
   ```bash
   cd backend
   npm start
   ```

2. Inicie o emulador/device

3. Execute o app no Android Studio

4. Verifique se as partidas aparecem na RecyclerView

✅ Se aparecer: Integração bem-sucedida!

---

**Pronto para integrar! 🚀**
