# Vesile - Ürün Yöneticisi (PM) Gözünden Durum Raporu & Yol Haritası

Bir Ürün Yöneticisi (PM) şapkasıyla Vesile projesinin mevcut durumunu (As-Is) analiz edip, MVP'nin (Minimum Viable Product) canlıya çıkabilmesi için tamamlanması gereken kilometretaşlarını (To-Be) aşağıda özetliyorum.

---

## 🏗️ 1. Mevcut Durum Analizi (Neredeyiz?)

Şu ana kadar geliştirilen özellikler, uygulamanın temel frontend mimarisini ve kullanıcı deneyimini başarıyla ayağa kaldırdı. Sadece UI/UX değil, iş mantığı (business logic) iskeleti de büyük oranda kurgulandı.

**Tamamlanan "Core" Değerler (✅ Done):**
- **Navigasyon ve Modüler Yapı:** 4 ana sekme (Keşfet, Eğitim, Adaylar, Profil) ve bu sekmelerin "Aday" ile "Refakatçi" modlarına göre dinamik değişimi başarıyla entegre edildi.
- **Tasarım Sistemi:** PRD felsefesine (The Vocabulary) uygun; krem, gece mavisi, altın tonlarında minimalist ve tipografi odaklı UI inşa edildi.
- **Eğitim Modülü ("Gate" Sistemi):** Kullanıcıların eşleşmeden önce zorunlu eğitim almasını sağlayan ilerleme (progress) ve rozet (gamification) sistemi (Zorunlu 3 seviye kuralı) yapıldı.
- **Keşfet (Match) Paneli:** Kart kaydırma yapısı, aday detaylarını görüntüleme, "Tanışmak İsterim" aksiyonu ve yaş/şehir bazlı filtreleme fonksiyonları eklendi.
- **Sohbet ve Gözlem Paneli:** Adayların mesajlaşabildiği, refakatçinin ise "Gözlemci (Salt Okunur)" olarak dahil olduğu üçlü chat altyapısının UI kurgusu ([Adaylar](file:///c:/Users/selim/Desktop/vesile/mobile/app/%28tabs%29/adaylar.tsx#560-829) ve `Gözlem` view'ları) tamamlandı.
- **UX İyileştirmeleri:** Pull-to-refresh (yukarı kaydırarak yenileme), haptic feedback (titreşim) ve soft renk geçişleri sağlandı. Muck data (sahte veri) ile akışlar test edilebilir hale geldi.

**Özetle:** Uygulamanın "Vitrin" ve "Kullanıcı Akışı" %90 oranında tamamlandı. Kullanıcı uygulamayı indirdiğinde ne yaşayacağını tam olarak görebiliyoruz.

---

## 🎯 2. MVP İçin Kilometretaşları (Milestones)

Uygulamanın sahte verilerden (mock-data) kurtulup, gerçek kullanıcılara (Beta/MVP) açılabilmesi için yapılması gereken sıradaki adımlar (Backend & AI entegrasyonları).

### Milestone 1: Backend & Veritabanı Entegrasyonu (Foundation)
*Kritik Görev: Herkesin kendi verisini görmesini sağlamak.*
- [ ] **Auth & Hardware ID Binding:** Kullanıcı giriş/kayıt sistemi. PRD'de belirtilen tek cihaza özel donanım kimliği (Hardware ID) kilidi.
- [ ] **Veritabanı Kurulumu (Supabase/Firebase):** Kullanıcı profilleri, eşleşme istekleri, eğitim ilerlemeleri ve sohbet odalarının gerçek bir veritabanına bağlanması.
- [ ] **State Management Geçişi:** [mock-data.ts](file:///c:/Users/selim/Desktop/vesile/mobile/lib/mock-data.ts)'nin silinip, gerçek API call'ları ile verilerin çekilmesi. (Eğitim seviyesi, gönderilen/alınan istekler vb. için).

### Milestone 2: Refakatçi - Aday Bağlantısı (Davet Sistemi)
*Kritik Görev: Uygulamanın kalbi olan "Şahitli Sistem"in çalışması.*
- [ ] **Deferred Deep Linking:** Adayın, bir kişiyi (örn: abisini/babasını) WhatsApp üzerinden "Refakatçim Ol" linki ile davet etmesi.
- [ ] **İlişki Kurulumu (Relationship DB):** Davet linkine tıklayan kişinin doğrudan o adayın refakatçisi olarak atanması ve "Emanetim" sekmesinde bu adayı görebilmesi.

### Milestone 3: Claude AI Entegrasyonları (Core Value)
*Kritik Görev: Vesile'yi klasik evlilik uygulamalarından ayıran "Denetlenebilir ve Eğitici" AI özelliklerinin eklenmesi.*
- [ ] **AI Karne Analizörü:** Refakatçinin "Emanetim" sekmesinde aday hakkında dolduracağı uzun metinli anketin, _Claude 3.5 Sonnet_ api'sine gönderilip 5 boyutlu bir karakter panosuna çevrilmesi.
- [ ] **Dinamik Fıkıh Penceresi:** Aday profillerinde veya sohbet ekranında, kullanıcının mezhebine ve görüşme aşamasına uygun edep kurallarının _Claude_ tarafından üretilip gösterilmesi.
- [ ] **Gerçek Zamanlı Moderasyon (Safety Guard):** Sohbet odasında yazılan mesajların _Claude 3 Haiku_ api'sinden geçerek (flört, argo, uygunsuz teklif) taranması ve ihlal durumunda refakatçiye anlık bildirim (push notification) gitmesi.

### Milestone 4: Güvenli Sohbet Odası Logic'i
*Kritik Görev: Üçlü chat sisteminin kurallarının (Business Logic) işletilmesi.*
- [ ] **Real-time Chat:** WebSockets veya Supabase Realtime ile mesajların anlık iletimi.
- [ ] **Oda Terk Protokolü:** Adaylardan biri ayrılmadan refakatçinin odadan çıkamaması (PRD kuralı) kısıtlamasının veritabanı seviyesinde uygulanması.

### Milestone 5: Publishing & Beta (Canlıya Çıkış)
- [ ] TestFlight (iOS) ve Google Play Console (Android) üzerinden alfa/beta testlerine çıkış.
- [ ] Hata takibi (Crashlytics) kurulumu ve ilk kullanıcı feedback'lerinin toplanması.

---

**PM Önerisi (Next Step):** 
Şu an Frontend (UI/UX) olarak MVP'ye yetecek bir noktadayız (Hatta bazı yerlerde MVP ötesine geçtik bile). Projeyi bir sonraki faza geçirmek için; veritabanı mimarisini seçip (örn: Supabase) **Auth ve İlişki Kurulumu (Milestone 1 ve 2)** süreçlerine başlamalıyız.
