# Ürün Gereksinimleri Dokümanı (PRD)
## Fetva Meclisi — Evlilik Rehberi & Aday Platformu

> **Model Hedefi:** Bu doküman, `claude-opus-4-6` modeli ile çalışacak AI destekli özellikler ve uygulama geliştirme süreçleri gözetilerek hazırlanmıştır.

---

## 1. Ürün Vizyonu

Bu platform, İslami usullere uygun bir evlilik süreci yürütmek isteyen kullanıcıları bir araya getirir. Temel amacı yalnızca aday eşleştirmesi değil; kullanıcıları Fetva Meclisi kaynaklı içeriklerle bu sürece **manevi ve ilmi olarak hazırlamaktır.**

### 1.1 Tasarım Felsefesi
- **Referans:** *The Vocabulary* uygulamasının ultra minimalist estetiği
- Ultra minimalist, tipografi odaklı arayüz
- Nefes alan boşluklar (generous whitespace)
- Sakinleştirici mikro animasyonlar
- Kağıt hissi veren krem zemin

### 1.2 Fonksiyonel Akış
- **Referans:** Tinder / OkCupid kullanıcı deneyimi
- Profil kartları ile göz atma
- Gelişmiş filtreleme ve istek takibi
- Eğitim tamamlama koşuluna bağlı iletişim kilidi (Gate)

---

## 2. Teknik Altyapı

| Katman | Teknoloji | Gerekçe |
|---|---|---|
| **Mobil (Frontend)** | Flutter veya React Native | iOS + Android tek kod tabanı |
| **Veritabanı** | PostgreSQL | İlişkisel veri, kullanıcı durumu, eğitim takibi |
| **AI Entegrasyonu** | Anthropic API — `claude-opus-4-6` | Dinamik Fıkıh Penceresi, içerik üretimi, moderasyon |
| **Backend** | Node.js / Django | REST API, bildirim servisleri |
| **Depolama** | AWS S3 / Supabase Storage | Profil fotoğrafları, video içerikler |

### 2.1 Claude claude-opus-4-6 Kullanım Alanları

```
1. Dinamik Fıkıh Penceresi  →  Profil verilerine göre bağlamsal içerik üretimi
2. Moderasyon Asistanı      →  3 kişilik grup mesajlarında içerik denetimi
3. Kişilik Analizi          →  Yaşam tarzı testleri sonucu özet rapor üretimi
4. Onboarding Asistanı      →  Yeni kullanıcıya uygulamayı tanıtma akışı
```

**API Çağrısı Örneği — Dinamik Fıkıh Penceresi:**

```javascript
const response = await fetch("https://api.anthropic.com/v1/messages", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    model: "claude-opus-4-6",
    max_tokens: 1000,
    system: `Sen Fetva Meclisi evlilik platformunun fıkıh asistanısın. 
             Kullanıcının profil bilgilerine göre nazik, kısa ve İslami usule uygun
             bir edep/kural hatırlatması yap. Maksimum 3 cümle.`,
    messages: [
      {
        role: "user",
        content: `Aday Profili: ${JSON.stringify(candidateProfile)}\n
                  Bu profile uygun fıkhi hatırlatma üret.`
      }
    ]
  })
});
```

---

## 3. Görsel Kimlik & Tasarım Sistemi

Fetva Meclisi kurumsal kimliği ile *The Vocabulary* sadeliği harmanlanacaktır.

| Element | Renk Kodu | Açıklama |
|---|---|---|
| **Arkaplan** | `#FDFCF8` — Krem | Göz yormayan, kağıt hissi veren ana zemin |
| **Ana Metin** | `#1A2A40` — Gece Mavisi | Başlıklar ve gövde metinleri |
| **Vurgular / İkonlar** | `#C5A059` — Altın | Aktif durumlar, yol haritası durakları, bildirimler |
| **Butonlar** | `#1A2A40` — Koyu Mavi | Ana aksiyon butonları (altın/beyaz metin) |
| **Eğitim Rozeti** | `#C5A059` üzeri `#FDFCF8` | Seviye rozetleri |

### 3.1 Tipografi
- **Başlıklar:** Serif (ör. Lora, Playfair Display)
- **Gövde:** Sans-serif (ör. Inter, DM Sans)
- **Arapça içerik:** Scheherazade New veya Amiri

---

## 4. Uygulama Mimarisi — Sekme Yapısı

Uygulama **4 ana sekmeden** oluşur. Alt navigasyon barı sabit kalır.

```
┌─────────────────────────────────────────────┐
│                  Uygulama                    │
├──────────┬──────────┬──────────┬────────────┤
│ 🔍 Keşfet│ 📚 Eğitim│ 💬 Adaylar│ 👤 Profil  │
│  Sekme 1 │  Sekme 2 │  Sekme 3 │  Sekme 4   │
└──────────┴──────────┴──────────┴────────────┘
```

---

## 5. Sekme 1 — Keşfet (Aday Kartları & Dinamik Fıkıh)

### 5.1 Görünüm
- Tek tam ekran kart (Tinder tarzı, vakur)
- Aşağı kaydırma ile diğer adaylara geçiş
- Üstte minimal logo + filtre ikonu

### 5.2 Kart İçeriği
```
┌─────────────────────────────┐
│   [ Profil Fotoğrafı ]       │
│                              │
│  Ad Soyad, 28 · İstanbul     │
│  Öğretmen                    │
│                              │
│  "Niyet: Sünnet olan yolu    │
│   ile beraber yürümek..."    │
│                              │
│  ╔════════════════════════╗  │
│  ║  🕌 Fıkıh Penceresi   ║  │  ← Krem Kutu (AI üretimli)
│  ║  Hanefî mezhebine göre ║  │
│  ║  görüşme adabı...      ║  │
│  ╚════════════════════════╝  │
│                              │
│  [  Kaydet  ]  [ İstek Gönder ]│
└─────────────────────────────┘
```

### 5.3 Dinamik Fıkıh Penceresi ("Krem Kutu")
- Adayın mezhep/profil bilgisine göre `claude-opus-4-6` tarafından üretilir
- Floating modül — profil detayında veya kart altında belirir
- Her açılışta taze içerik (cache: 24 saat)

### 5.4 Aksiyonlar
| Aksiyon | Durum | Sonuç |
|---|---|---|
| **İstek Gönder** | Her zaman aktif | İstek listesine düşer |
| **Kaydet** | Her zaman aktif | Favoriler listesine eklenir |
| **İletişim** | Yalnızca Eğitim 3. Seviye + Onay | 3 kişilik grup açılır |

---

## 6. Sekme 2 — Eğitim & Kurs Modülü (Evlilik Rehberi)

### 6.1 Görünüm
Dikey, oyunlaştırılmış yol haritası (Roadmap). Temiz dikey çizgi üzerinde **altın dairesel duraklar.**

```
        ●  Başlangıç
        │
        ●  1. Seviye: Evliliğin Önemi
        │       └─ Video · Makale · Test ✓
        │
        ●  2. Seviye: Mehir ve Nikâh Şartları
        │       └─ Video · Makale · Test ✓
        │
       🔒  3. Seviye: Görüşme Usulü          ← GATE
        │       └─ Video · Makale · Test
        │         [Bu seviyeyi tamamla →
        │          Mesajlaşma aktive olur]
        │
        ○  4. Seviye: Aile Kurma Sorumluluğu
        │
        ○  5. Seviye: ...
```

### 6.2 İşleyiş Kuralları
- Dersler sıralı açılır (önceki tamamlanmadan sonraki kilitli)
- İçerik türleri: Nureddin Yıldız videoları, makaleler, anlama testleri
- Her dersin sonunda **basit anlama testi** zorunludur

### 6.3 Gate (Kilit) Mekanizması — Kritik

```
Koşul: 3. Seviye ("Görüşme Usulü") TAMAMLANMAMIŞSA
  → İstek Gönder butonu: AKTİF ✓
  → Onay geldikten sonra Mesajlaşma: KİLİTLİ 🔒
  → Sistem uyarısı: "Mesajlaşmayı başlatmak için
                     3. seviyeyi tamamlamalısınız"

Koşul: 3. Seviye TAMAMLANMIŞSA
  → Onaylı istekler için 3 kişilik grup: AKTİF ✓
```

---

## 7. Sekme 3 — Aday Yönetimi (İstek Takibi & İletişim)

### 7.1 Alt Bölüm A: İstek Takibi

Tüm gönderilen isteklerin kronolojik listesi.

| Durum Etiketi | Renk | Açıklama |
|---|---|---|
| **Beklemede** | `#1A2A40` Mavi | İstek iletildi, cevap bekleniyor |
| **Onaylandı** | `#C5A059` Altın | Karşı taraf kabul etti |
| **Reddedildi** | `#9E9E9E` Gri | Karşı taraf reddetti |

Her istek kartının yanında **"Bilgi Butonu"** → Krem Kutu tetikler (AI üretimli fıkıh adabı).

### 7.2 Alt Bölüm B: Mesajlaşma (Yalnızca Uygun Adaylar)

**Erişim Koşulları:**
1. ✅ Kullanıcı Eğitim 3. Seviyeyi tamamlamış
2. ✅ Karşılıklı istek onaylanmış

**3 Kişilik Grup Yapısı (Harem-Selamlık Odası):**

```
┌─────────────────────────────────────┐
│  Sohbet: Ahmed B. & Fatma K.        │
│  Moderatör: Veli / Denetleyici      │
├─────────────────────────────────────┤
│                                     │
│  [Ahmed]: Merhaba, tanışmak...      │
│                    [Fatma]: Merhaba │
│  [Veli ✓]: Hayırlı görüşmeler       │
│                                     │
│  ┌─────────────────────────────┐    │
│  │  Mesaj yaz...          [→]  │    │
│  └─────────────────────────────┘    │
└─────────────────────────────────────┘
```

**Grup Üyeleri:**
| Rol | Açıklama |
|---|---|
| **Talip (Erkek)** | İstek gönderen, eğitim şartını karşılayan kullanıcı |
| **Aday (Kadın)** | İsteği onaylayan, platform kullanıcısı |
| **Moderatör/Veli** | Denetleyici; tüm mesajları görebilir, raporlayabilir |

**Moderasyon:**
- Her mesaj denetleyici paneline düşer
- `claude-opus-4-6` destekli otomatik içerik filtresi
- Kullanıcı başına raporlama mekanizması

---

## 8. Sekme 4 — Profil & Kişilik Analizi

### 8.1 Görünüm
*The Vocabulary* tarzı temiz form alanları, minimal input tasarımı.

### 8.2 İçerik Bölümleri

**a) Kişisel Bilgiler**
- Ad, Yaş, Şehir, Meslek
- Profil fotoğrafı
- Kısa "Niyet" metni

**b) Fıkhi Görüş & Yaşam Tarzı Testleri**
- Mezhep tercihi
- Namaz, oruç, tesettür alışkanlıkları
- Aile yapısı beklentileri
- Her bölümde Krem Kutu hatırlatıcıları (AI destekli)

**c) Eğitim Durumu Rozeti**
```
┌─────────────────┐
│  [ Fotoğraf ]   │
│                 │
│  ★ 3. Seviye    │  ← Profil altı rozet
│    Mezunu       │
└─────────────────┘
```

---

## 9. Kullanıcı Hikayeleri & Kısıtlamalar

| # | Senaryo | Kısıtlama |
|---|---|---|
| **US-01** | Kullanıcı eğitim almadan aday profillerini görür ve kaydeder | ✅ İzin var |
| **US-02** | Kullanıcı eğitim almadan istek gönderir | ✅ İzin var |
| **US-03** | Karşı taraf isteği onaylar, ancak kullanıcı 3. Seviyeyi tamamlamamıştır | ❌ Grup açılmaz — uyarı verilir |
| **US-04** | Kullanıcı 3. Seviyeyi tamamlar ve karşılıklı onay mevcuttur | ✅ 3 kişilik grup aktive olur |
| **US-05** | Moderatör grupta uygunsuz içerik tespit eder | ⚠️ Raporlama + otomatik filtre devreye girer |

---

## 10. AI Özellik Detayları — `claude-opus-4-6` Entegrasyonu

### 10.1 Özellik Listesi

| Özellik | Tetikleyici | Model Görevi |
|---|---|---|
| **Dinamik Fıkıh Penceresi** | Aday profili açıldığında | Mezhep + kriterlere göre bağlamsal içerik üret |
| **Kişilik Analizi Özeti** | Profil testleri tamamlandığında | Test sonuçlarını analiz et, özet rapor yaz |
| **Moderasyon Asistanı** | Her mesaj gönderiminde | Uygunsuz içerik tespiti, şiddet/hakaret filtresi |
| **Onboarding Sohbet Botu** | İlk kayıt sonrası | Uygulamayı adım adım tanıt |
| **Eğitim İçerik Özeti** | Ders tamamlandığında | Öğrenilen konuyu kısa maddelerle özetle |

### 10.2 Güvenlik & Kısıtlamalar
- Tüm AI çıktıları `system prompt` ile sınırlandırılır
- Kullanıcı verileri API'ye anonimleştirilerek gönderilir
- Her yanıt uzunluğu `max_tokens: 1000` ile sınırlıdır
- Rate limiting: Kullanıcı başına günde maksimum 50 AI çağrısı

---

## 11. Akış Diyagramı — Temel Kullanıcı Yolculuğu

```
Kayıt / Giriş
      │
      ▼
Profil Oluştur (Sekme 4)
      │
      ▼
Adayları Keşfet (Sekme 1)  ←─────────────────┐
      │                                        │
      ▼                                        │
İstek Gönder                                   │
      │                                        │
      ▼                                        │
Karşı Taraf Onayladı mı?                       │
   │         │                                 │
  Evet      Hayır ──► Beklemeye Devam ─────────┘
   │
   ▼
Kullanıcı 3. Seviyeyi Tamamladı mı?
   │               │
  Evet            Hayır
   │               │
   │               ▼
   │         Eğitim Modülüne Yönlendir (Sekme 2)
   │               │
   │       3. Seviye Tamamlandı
   │               │
   └───────────────┘
              │
              ▼
    3 Kişilik Grup Aktive → Mesajlaşma Başlar (Sekme 3)
```

---

## 12. Sonraki Adımlar & Yol Haritası

| Faz | Kapsam | Süre (Tahmini) |
|---|---|---|
| **Faz 1 — MVP** | Profil, Keşfet, İstek Gönder, Temel Eğitim (1-3. Seviye) | 10 hafta |
| **Faz 2 — Gate + Mesajlaşma** | 3 kişilik grup, Gate mekanizması, Moderasyon | 6 hafta |
| **Faz 3 — AI Entegrasyonu** | Dinamik Fıkıh Penceresi, Kişilik Analizi, Onboarding Bot | 4 hafta |
| **Faz 4 — İçerik Genişletme** | 4-10. Seviye dersler, rozet sistemi, bildirimler | Süregelen |

---

*Bu doküman `claude-opus-4-6` modeli ile uyumlu AI entegrasyonları gözetilerek hazırlanmıştır.*
*Son Güncelleme: Mart 2026*
