# Ürün Gereksinimleri Dokümanı (PRD) — v2.1

## Proje Adı: Vesile (Evlilik Rehberi & Eşleşme Platformu)

> **Model Hedefi:** Bu doküman, **Anthropic Claude 3.5 Sonnet / Claude 3 Haiku** modelleri ile çalışacak AI özellikleri ve ultra-minimalist mobil geliştirme süreçleri gözetilerek hazırlanmıştır.

---

## 1. Ürün Vizyonu & Felsefesi

**Vesile**, evlilik niyetinde olan bireyleri İslami usullere uygun, denetlenebilir ve eğitici bir zeminde buluşturan dijital bir "Güvenli Liman"dır. Sadece bir eşleşme uygulaması değil, ailelerin ve şahitlerin (refakatçi) aktif rol aldığı bir müessesedir.

### 1.1 Tasarım Felsefesi

- **Referans:** *The Vocabulary* (Ultra-minimalist, tipografi odaklı)
- **Zemin:** `#FDFCF8` (Krem — Kağıt hissi)
- **Mod Seçici (Identity Switcher):** Profil sayfasında dikey bölünmüş buton:
  - **Refakatçi Modu:** `#BF4646` (Kırmızı Tonu — Sorumluluk)
  - **Aday Modu:** `#7EACB5` (Mavi-Yeşil Tonu — Niyet)

---

## 2. Teknik Altyapı

| Katman | Teknoloji | Gerekçe |
|---|---|---|
| **Mobil** | Flutter veya React Native | iOS + Android tek kod tabanı, hızlı UI prototipleme |
| **AI Entegrasyonu** | **Anthropic Claude 3.5 Sonnet** (ağır görevler) / **Claude 3 Haiku** (gerçek zamanlı moderasyon) | Uzun bağlam penceresi (200K token), güçlü talimat uyumu, hızlı yanıt |
| **AI API Erişimi** | **Anthropic Messages API** (`/v1/messages`) | Sistem promptu + kullanıcı mesajı ayrımı ile güvenli rol kontrolü |
| **Güvenlik** | **Hardware ID Binding** | Tek cihazda tek hesap; sahte refakatçi hesaplarını önleme |
| **Davet Sistemi** | **Deferred Deep Linking** | WhatsApp linki ile uygulama indirilse dahi davet token'ının korunması |
| **Veritabanı** | PostgreSQL / Supabase | İlişkisel veri, kullanıcı durumu ve eğitim takibi |

---

## 3. Uygulama Mimarisi — Hibrit Sekme Yapısı

Uygulama, kullanıcının aktif moduna (Aday veya Refakatçi) göre dinamik olarak değişen 4 ana sekmeden oluşur.

| Sekme | Bekar (Aday) Modu | Refakatçi Modu | Fonksiyon |
|---|---|---|---|
| **Sekme 1** | 🔍 Keşfet | 🛡️ Emanetim | Aday arama / Refakat edilen kişinin karnesini doldurma |
| **Sekme 2** | 📚 Eğitim | 📚 Eğitim | Fetva Meclisi müfredatı — aynı içerik ve ilerleme sistemi |
| **Sekme 3** | 💬 Adaylar | 👁️ Gözlem | Chat listesi / Refakatçi için salt okunur izleme paneli |
| **Sekme 4** | 👤 Profil | 👤 Profil | Ayarlar, Kimlik Seçici ve Eğitim Rozeti |

---

## 4. Temel Özellikler & Protokoller

### 4.1 360° Refakatçi Karnesi (Emanetim Sekmesi)

Refakatçi, aday hakkında Claude tarafından analiz edilecek kapsamlı bir anket doldurur.

**Kategoriler:**
- Çocukluk ve mizaç
- Mesleki yetenekler / yatkınlıklar
- Fıkhi hassasiyetler
- Sosyal vefa

**AI Analizi:** Claude, refakatçinin serbest metin cevaplarını yorumlayarak aday profilinde "Refakatçi Gözüyle Portre" özeti yayınlar.

> **Claude Notu:** Serbest metin analizi Claude'un güçlü olduğu bir alan; yapılandırılmamış girdileri dahi tutarlı, Türkçe biçimlendirilmiş çıktılara dönüştürmek için sistem promptu aşağıdaki gibi tasarlanmalıdır:

```
SYSTEM:
Sen Vesile uygulamasının Karne Analizörüsün.
Refakatçinin cevaplarını analiz ederek adayın karakter profilini
şu 5 boyutta değerlendir: Dürüstlük, Sorumluluk, Empati, Dini Hassasiyet, Sosyal Uyum.
Her boyutu 1-10 arası puanla ve kısa bir gerekçe yaz.
Çıktını JSON formatında döndür.
```

### 4.2 Güvenli Sohbet Odası (Gözetimli Chat)

- **Zorunlu Refakat:** Mesajlaşma alanı, refakatçi odaya bağlanmadan adaylar için kilitlidir.
- **Oda Terk Protokolü:** Adaylardan biri "Görüşmeden Ayrıl" diyerek odayı pasifleştirebilir. Refakatçi, ancak iki taraftan biri ayrıldıktan sonra odayı terk edebilir (*"Gemiyi en son kaptan terk eder"*).
- **Gözlemci Yetkisi:** Refakatçi mesaj yazamaz; yalnızca akışı izler ve uygunsuz durumda raporlar.

---

## 5. Claude AI Entegrasyon Detayları

### Model Seçim Stratejisi

| Görev | Önerilen Model | Gerekçe |
|---|---|---|
| Karne Analizi | `claude-sonnet-4-20250514` | Uzun metin anlama, nüanslı değerlendirme |
| Gerçek Zamanlı Moderasyon | `claude-haiku-4-5` | Düşük gecikme, yüksek hacimli mesaj tarama |
| Dinamik Fıkıh Penceresi | `claude-sonnet-4-20250514` | Bağlam duyarlı, mezhep uyumlu yanıtlar |
| Onboarding Kişiselleştirme | `claude-haiku-4-5` | Hızlı karşılama, düşük maliyet |

### 5.1 Dinamik Fıkıh Penceresi

Aday profillerine ve mezhep bilgilerine göre bağlamsal "Edep ve Kural" hatırlatmaları üretir.

**Prompt Şablonu:**
```
SYSTEM:
Kullanıcı [MEZHEP] mezhebine mensuptur.
Şu an bir evlilik görüşmesinin [AŞAMA] aşamasındadır.
Bu aşamaya özgü 3 kısa edep hatırlatması üret.
Türkçe, sade ve uyarıcı bir dil kullan.
```

### 5.2 Sohbet Moderasyonu

Chat akışında Claude Haiku ile gerçek zamanlı içerik taraması yapılır. Uygunsuz içerik (argo, flörtöz sınır aşımı, uygunsuz teklif) tespit edildiğinde refakatçi anında bildirim alır.

**Moderasyon Yanıt Şeması:**
```json
{
  "uygun": true | false,
  "ihlal_seviyesi": "düşük" | "orta" | "yüksek",
  "ihlal_kategorisi": "argo" | "flört" | "teklif" | "diğer",
  "refakatci_uyarisi": "string"
}
```

### 5.3 Karne Analizörü

Refakatçinin uzun metinli cevaplarını analiz ederek adayın profilinde "Karakter Analiz Grafiği" oluşturur.

**Çıktı Şeması (5 Boyutlu Radar Grafiği):**
```json
{
  "boyutlar": {
    "dürüstlük": { "puan": 8, "gerekce": "..." },
    "sorumluluk": { "puan": 7, "gerekce": "..." },
    "empati": { "puan": 9, "gerekce": "..." },
    "dini_hassasiyet": { "puan": 8, "gerekce": "..." },
    "sosyal_uyum": { "puan": 6, "gerekce": "..." }
  },
  "ozet_portre": "string (max 150 kelime)",
  "guclu_yonler": ["...", "..."],
  "dikkat_alanlari": ["...", "..."]
}
```

### 5.4 Onboarding Kişiselleştirme

Kullanıcının seçtiği kimliğe (Aday / Refakatçi) ve demografik bilgilerine göre Claude özelleştirilmiş karşılama mesajı üretir.

---

## 6. Görsel Kimlik & Renk Sistemi

| Element | Renk Kodu | Açıklama |
|---|---|---|
| **Zemin** | `#FDFCF8` | Ana krem zemin |
| **Refakatçi Buton** | `#BF4646` | Profil sayfasındaki dikey switcher (Sol) |
| **Aday Buton** | `#7EACB5` | Profil sayfasındaki dikey switcher (Sağ) |
| **Vurgular** | `#C5A059` | Eğitim rozetleri ve aktif ikonlar (Altın) |
| **Tipografi** | `#1A2A40` | Başlıklar ve gövde metinleri (Gece Mavisi) |

---

## 7. Kısıtlamalar & Güvenlik

- **Evli Kullanıcılar:** Profil oluştururken "Evli" işaretleyen kişiler için "Keşfet" (Sekme 1) kalıcı olarak kapalıdır; yalnızca refakatçi olabilirler.
- **Tek Cihaz:** Hardware ID eşleşmesi sayesinde her kullanıcı tek bir cihazda aktif olabilir.
- **Eğitim Kapısı (Gate):** 3. Seviye eğitimi tamamlamayan adaylar mesajlaşma aşamasına geçemez.
- **Claude Güvenliği:** Tüm Claude API çağrıları sunucu taraflı (backend) yapılır; API anahtarı istemciye asla açık bırakılmaz.

---

## 8. Claude API Entegrasyon Notları

### Önerilen SDK

```bash
npm install @anthropic-ai/sdk        # Node.js / React Native
pip install anthropic                # Python backend
```

### Temel Çağrı Yapısı

```javascript
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const response = await client.messages.create({
  model: "claude-sonnet-4-20250514",
  max_tokens: 1024,
  system: SYSTEM_PROMPT,             // Rol ve kısıtlamalar buraya
  messages: [
    { role: "user", content: userInput }
  ]
});
```

### Maliyet Optimizasyonu

- Moderasyon görevleri → **Haiku** (hız + maliyet)
- Analiz ve üretim görevleri → **Sonnet** (kalite)
- Prompt önbellekleme (`cache_control`) ile tekrarlayan sistem promptlarında maliyet düşürülür

---

*Bu doküman `claude-sonnet-4-20250514` ve `claude-haiku-4-5` modelleriyle uyumlu AI entegrasyonları gözetilerek hazırlanmıştır.*  
*Son Güncelleme: 10 Mart 2026*
