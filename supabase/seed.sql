-- Vesile - Seed Data
-- Bu dosya geliştirme ortamı için örnek veriler içerir.
-- Supabase Dashboard > SQL Editor'de çalıştırılabilir.
-- NOT: Auth kullanıcıları Supabase Dashboard'dan manuel oluşturulmalıdır.
-- Aşağıdaki UUID'ler, auth.users'daki gerçek kullanıcı ID'leri ile değiştirilmelidir.

-- Örnek UUID'ler (auth.users tablosunda karşılığı oluşturulduktan sonra kullanılacak)
-- user1: 11111111-1111-1111-1111-111111111111 (Fatma Yılmaz)
-- user2: 22222222-2222-2222-2222-222222222222 (Ayşe Kara)
-- user3: 33333333-3333-3333-3333-333333333333 (Zeynep Demir)
-- user4: 44444444-4444-4444-4444-444444444444 (Hatice Çelik)
-- user5: 55555555-5555-5555-5555-555555555555 (Ahmed Bakır - currentUser)
-- user6: 66666666-6666-6666-6666-666666666666 (Mehmet Aksoy)
-- user7: 77777777-7777-7777-7777-777777777777 (Hasan Bakır - refakatçi)
-- user8: 88888888-8888-8888-8888-888888888888 (Ömer Şahin)

/*
-- Profiller (auth.users oluşturulduktan sonra çalıştırın)
INSERT INTO profiles (id, full_name, age, city, profession, bio, gender, mezhep, namaz_regularity, education_level, marital_status) VALUES
('11111111-1111-1111-1111-111111111111', 'Fatma Yılmaz', 26, 'İstanbul', 'Öğretmen', 'Sünnet olan yolu ile beraber yürümek niyetindeyim.', 'female', 'hanefi', '5 vakit düzenli', 3, 'bekar'),
('22222222-2222-2222-2222-222222222222', 'Ayşe Kara', 24, 'Ankara', 'Hemşire', 'Sabırlı ve anlayışlı bir eş adayı.', 'female', 'hanefi', '5 vakit düzenli', 2, 'bekar'),
('33333333-3333-3333-3333-333333333333', 'Zeynep Demir', 28, 'İzmir', 'Avukat', 'Dinine bağlı, ilim ehli bir hayat arkadaşı arıyorum.', 'female', 'shafii', '5 vakit düzenli', 4, 'bekar'),
('44444444-4444-4444-4444-444444444444', 'Hatice Çelik', 23, 'Bursa', 'Eczacı', 'Hayırlı bir yuva kurmak en büyük hayalim.', 'female', 'hanefi', '5 vakit düzenli', 1, 'bekar'),
('55555555-5555-5555-5555-555555555555', 'Ahmed Bakır', 29, 'İstanbul', 'Yazılım Mühendisi', 'Dinini yaşayan, ailesiyle barışık bir eş arıyorum.', 'male', 'hanefi', '5 vakit düzenli', 0, 'bekar'),
('66666666-6666-6666-6666-666666666666', 'Mehmet Aksoy', 31, 'Konya', 'Doktor', 'Sağlık sektöründe çalışan, dini hassasiyetleri yüksek.', 'male', 'hanefi', '5 vakit düzenli', 3, 'bekar'),
('77777777-7777-7777-7777-777777777777', 'Hasan Bakır', 45, 'İstanbul', 'İş İnsanı', 'Kardeşimin evlilik sürecinde refakatçisi.', 'male', 'hanefi', '5 vakit düzenli', 5, 'evli'),
('88888888-8888-8888-8888-888888888888', 'Ömer Şahin', 27, 'Antalya', 'Mimar', 'Hayatını İslami değerlerle şekillendiren bir mimar.', 'male', 'maliki', '5 vakit düzenli', 2, 'bekar');

-- Refakatçi İlişkisi
INSERT INTO guardian_relations (refakatci_id, aday_id, relation) VALUES
('77777777-7777-7777-7777-777777777777', '55555555-5555-5555-5555-555555555555', 'Ağabey');

-- Eşleşme İstekleri
INSERT INTO match_requests (sender_id, receiver_id, status) VALUES
('55555555-5555-5555-5555-555555555555', '11111111-1111-1111-1111-111111111111', 'accepted'),
('55555555-5555-5555-5555-555555555555', '22222222-2222-2222-2222-222222222222', 'pending'),
('55555555-5555-5555-5555-555555555555', '33333333-3333-3333-3333-333333333333', 'rejected');

-- Sohbet Odası (Ahmed + Fatma, Refakatçi: Hasan)
INSERT INTO chat_rooms (id, aday1_id, aday2_id, refakatci_id, status) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '55555555-5555-5555-5555-555555555555', '11111111-1111-1111-1111-111111111111', '77777777-7777-7777-7777-777777777777', 'active');

INSERT INTO messages (room_id, sender_id, sender_name, content, is_system) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'system', 'Sistem', 'Refakatçi Hasan Bakır odaya katıldı. Sohbet başlayabilir.', true),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '55555555-5555-5555-5555-555555555555', 'Ahmed', 'Selamün aleyküm Fatma Hanım, nasılsınız?', false),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'Fatma', 'Aleyküm selam Ahmed Bey, iyiyim elhamdülillah.', false);

-- Eğitim İlerleme (Ahmed, henüz hiç tamamlamamış)
-- (Boş bırakıldı, çünkü education_level = 0)
*/
