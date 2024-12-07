# FastAPI Projesi

Bu proje, FastAPI ile bir API uygulaması geliştirmek için temel bir yapıyı içerir. Aşağıdaki adımları izleyerek projeyi kurabilir ve çalıştırabilirsiniz.

## Gereksinimler

- Python 3.8 veya üzeri
- `pip` (Python paket yöneticisi)

---

## Kurulum

### 2. Sanal ortam oluşturun ve etkinleştirin

#### Linux/MacOS:

```
python3 -m venv .venv
source .venv/bin/activate
```

#### Windows:

```
python -m venv .venv
.venv\Scripts\activate
```

### 3. Gerekli paketleri yükleyin

```
pip install --upgrade pip
pip install -r requirements.txt
```

### Projeyi Çalıştırma

#### Uygulamayı uvicorn kullanarak başlatın:

```
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

#### Parametre Açıklamaları:

app:app: app.py dosyasındaki FastAPI uygulamasını ifade eder (projede oluşturduğunuz dosya adı farklıysa değiştirmeyi unutmayın).
--host 0.0.0.0: Uygulamayı tüm ağ arayüzlerinde erişilebilir kılar.
--port 8000: API'nin çalışacağı port numarası.
--reload: Kod değişikliklerinde uygulamayı otomatik yeniden başlatır (geliştirme için önerilir).
