import { Profile, EducationLevel, MatchRequest } from "./types";

export const mockProfiles: Profile[] = [
  {
    id: "1",
    full_name: "Fatma Yılmaz",
    age: 26,
    city: "İstanbul",
    profession: "Öğretmen",
    bio: "Sünnet olan yolu ile beraber yürümek niyetindeyim. Sabırlı, anlayışlı ve dinine bağlı bir eş arıyorum.",
    avatar_url: null,
    gender: "female",
    mezhep: "hanefi",
    namaz_regularity: "5 vakit düzenli",
    education_level: 3,
    created_at: "2026-01-15T10:00:00Z",
  },
  {
    id: "2",
    full_name: "Ayşe Kara",
    age: 24,
    city: "Ankara",
    profession: "Hemşire",
    bio: "Hayırlı bir yuva kurmak en büyük dileğim. Dini hassasiyetlere sahip, samimi birini arıyorum.",
    avatar_url: null,
    gender: "female",
    mezhep: "hanefi",
    namaz_regularity: "5 vakit düzenli",
    education_level: 2,
    created_at: "2026-02-01T10:00:00Z",
  },
  {
    id: "3",
    full_name: "Zeynep Demir",
    age: 28,
    city: "Bursa",
    profession: "Grafik Tasarımcı",
    bio: "İslami değerlere bağlı, huzurlu bir aile kurmak istiyorum. Sanat ve edebiyata meraklıyım.",
    avatar_url: null,
    gender: "female",
    mezhep: "shafii",
    namaz_regularity: "5 vakit düzenli",
    education_level: 3,
    created_at: "2026-02-10T10:00:00Z",
  },
  {
    id: "4",
    full_name: "Meryem Özkan",
    age: 25,
    city: "Konya",
    profession: "Eczacı",
    bio: "Allah'ın rızasını gözeterek hayırlı bir eş bulmak niyetindeyim.",
    avatar_url: null,
    gender: "female",
    mezhep: "hanefi",
    namaz_regularity: "5 vakit düzenli",
    education_level: 1,
    created_at: "2026-02-20T10:00:00Z",
  },
  {
    id: "5",
    full_name: "Ahmed Bakır",
    age: 30,
    city: "İstanbul",
    profession: "Yazılım Mühendisi",
    bio: "Dinini yaşayan, hayatı birlikte inşa edebileceğim bir eş arıyorum.",
    avatar_url: null,
    gender: "male",
    mezhep: "hanefi",
    namaz_regularity: "5 vakit düzenli",
    education_level: 3,
    created_at: "2026-01-20T10:00:00Z",
  },
  {
    id: "6",
    full_name: "Mehmet Arslan",
    age: 27,
    city: "İzmir",
    profession: "Doktor",
    bio: "Sağlam temeller üzerine kurulu huzurlu bir aile hayali ile buradayım.",
    avatar_url: null,
    gender: "male",
    mezhep: "hanefi",
    namaz_regularity: "5 vakit düzenli",
    education_level: 2,
    created_at: "2026-02-05T10:00:00Z",
  },
];

export const mockEducationLevels: EducationLevel[] = [
  {
    id: 1,
    title: "Evliliğin Önemi",
    description: "İslam'da evliliğin yeri, hikmeti ve fazileti",
    contents: [
      {
        id: "1-1",
        type: "article",
        title: "İslam'da Evliliğin Yeri",
        body: `İslam dini, evliliği toplumun temel taşı olarak kabul eder. Peygamber Efendimiz (s.a.v.) "Nikâh benim sünnetimdir" buyurmuştur.\n\nEvlilik, insanın fıtratına en uygun yaşam biçimidir. Kur'an-ı Kerim'de "Kaynaşmanız için size kendi cinsinizden eşler yaratıp aranıza sevgi ve merhamet koyması, O'nun varlığının delillerindendir" (Rum, 21) buyurulmaktadır.\n\nEvliliğin faydaları:\n• Nefsin korunması\n• Neslin devamı\n• Huzur ve sükûnet\n• Karşılıklı destek ve yardımlaşma\n• Toplumsal düzenin korunması`,
      },
      {
        id: "1-2",
        type: "article",
        title: "Eş Seçiminde Dikkat Edilecekler",
        body: `Peygamber Efendimiz (s.a.v.) eş seçiminde dört özelliğe dikkat edilmesini tavsiye etmiştir: Malı, soyu, güzelliği ve dini.\n\n"Sen dindar olanı seç ki ellerin bereketlensin" buyurmuştur.\n\nEş seçiminde önemli kriterler:\n• Din ve ahlak anlayışı\n• Karakter uyumu\n• Ailelerin tanışması\n• İstişare ve istihareler\n• Karşılıklı rıza`,
      },
    ],
    quiz: [
      {
        id: "q1-1",
        question: "Peygamber Efendimiz nikâh hakkında ne buyurmuştur?",
        options: [
          "Nikâh benim sünnetimdir",
          "Nikâh farz-ı ayındır",
          "Nikâh vaciptir",
          "Nikâh müstehaptır",
        ],
        correctIndex: 0,
      },
      {
        id: "q1-2",
        question: "Eş seçiminde en çok hangi özelliğe dikkat edilmelidir?",
        options: ["Malı", "Güzelliği", "Soyu", "Dindarlığı"],
        correctIndex: 3,
      },
    ],
  },
  {
    id: 2,
    title: "Mehir ve Nikâh Şartları",
    description: "Nikâhın şartları, mehir ve düğün adabı",
    contents: [
      {
        id: "2-1",
        type: "article",
        title: "Nikâhın Şartları",
        body: `Nikâhın sahih olabilmesi için bazı şartların yerine getirilmesi gerekir:\n\n1. İcap ve Kabul: Tarafların karşılıklı rızası\n2. Şahitler: En az iki erkek veya bir erkek iki kadın şahit\n3. Veli İzni: Hanefî mezhebine göre akıl baliğ kadın kendi başına nikâhlanabilir, ancak velinin izni müstehaptır\n4. Mehir: Erkeğin kadına verdiği mal veya para\n\nNikâhın rükünleri:\n• Evlenecek taraflar\n• İcap (teklif)\n• Kabul (onay)`,
      },
      {
        id: "2-2",
        type: "article",
        title: "Mehir ve Önemi",
        body: `Mehir, erkeğin evlenirken kadına vermeyi taahhüt ettiği mal veya paradır. Kur'an-ı Kerim'de "Kadınlara mehirlerini gönül hoşluğuyla verin" (Nisa, 4) buyurulmaktadır.\n\nMehir türleri:\n• Mehr-i Muaccel: Nikâh anında peşin verilen\n• Mehr-i Müeccel: Sonraya bırakılan\n\nMehir miktarı:\n• Asgari bir sınır yoktur\n• Abartılı mehir talepleri hoş karşılanmaz\n• "En hayırlı nikâh, en kolay olanıdır" hadisi rehberdir`,
      },
    ],
    quiz: [
      {
        id: "q2-1",
        question: "Nikâhta en az kaç şahit bulunmalıdır?",
        options: ["1 erkek", "2 erkek", "3 erkek", "4 erkek"],
        correctIndex: 1,
      },
      {
        id: "q2-2",
        question: "Mehr-i Muaccel ne demektir?",
        options: [
          "Sonraya bırakılan mehir",
          "Peşin verilen mehir",
          "Mehir vermemek",
          "Hediye vermek",
        ],
        correctIndex: 1,
      },
    ],
  },
  {
    id: 3,
    title: "Görüşme Usulü",
    description: "İslami adaba uygun görüşme ve tanışma kuralları — GATE SEVİYESİ",
    contents: [
      {
        id: "3-1",
        type: "article",
        title: "İslami Görüşme Adabı",
        body: `Evlenme niyetiyle yapılan görüşmelerde İslami edeplere riayet edilmelidir:\n\n1. Niyet: Görüşme mutlaka evlilik niyetiyle yapılmalıdır\n2. Mahremiyet: Yalnız başına kalınmamalı, yanlarında bir mahrem bulunmalıdır\n3. Bakış: Helal dairede, ölçülü bakış\n4. Konuşma: Ciddi, saygılı ve amaca yönelik\n5. Süre: Görüşmeler gereksiz uzatılmamalıdır\n\nPeygamber Efendimiz (s.a.v.) buyurmuştur: "Biriniz bir kadınla evlenmek istediğinde, onu evliliğe teşvik eden tarafına bakabilirse baksın."`,
      },
      {
        id: "3-2",
        type: "article",
        title: "Dijital Ortamda Görüşme Kuralları",
        body: `Modern dijital ortamda da İslami edeplere uyulmalıdır:\n\n1. Mesajlaşma: Ölçülü ve amaca yönelik olmalı\n2. Mahrem Bilgi: Özel bilgiler paylaşılmamalı\n3. Fotoğraf: Uygun şekilde, veli bilgisi dahilinde\n4. Zaman: Gece geç saatlerde mesajlaşmaktan kaçınılmalı\n5. Moderatör: Platformda veli veya güvenilir kişi gözetiminde iletişim\n\nBu platformda 3 kişilik grup sistemi ile İslami görüşme adabı korunur.`,
      },
    ],
    quiz: [
      {
        id: "q3-1",
        question:
          "İslami görüşme adabına göre görüşmede yanlarında kim bulunmalıdır?",
        options: [
          "Arkadaş",
          "Mahrem (veli)",
          "Hiç kimse",
          "Komşu",
        ],
        correctIndex: 1,
      },
      {
        id: "q3-2",
        question:
          "Bu platformdaki mesajlaşma sistemi nasıl çalışır?",
        options: [
          "İki kişilik özel sohbet",
          "Toplu mesaj",
          "3 kişilik grup (moderatör dahil)",
          "Anonim mesajlaşma",
        ],
        correctIndex: 2,
      },
    ],
  },
  {
    id: 4,
    title: "Aile Kurma Sorumluluğu",
    description: "Aile reisi olmanın sorumlulukları ve karşılıklı haklar",
    contents: [
      {
        id: "4-1",
        type: "article",
        title: "Ailede Karşılıklı Haklar",
        body: `İslam'da eşlerin birbirleri üzerinde hakları vardır:\n\nKocanın Hakları:\n• Meşru konularda itaat\n• Evin düzenini koruma\n• İffetini muhafaza\n\nKadının Hakları:\n• Nafaka (geçim)\n• İyi muamele\n• Eğitim ve gelişim hakkı\n• Mehir hakkı\n\nOrtak Sorumluluklar:\n• Çocukların terbiyesi\n• Karşılıklı saygı ve sevgi\n• İstişare ile karar alma`,
      },
    ],
    quiz: [
      {
        id: "q4-1",
        question: "Aşağıdakilerden hangisi kadının haklarından biridir?",
        options: [
          "Evin düzenini koruma",
          "Nafaka (geçim)",
          "Meşru konularda itaat",
          "Hiçbiri",
        ],
        correctIndex: 1,
      },
    ],
  },
  {
    id: 5,
    title: "Mutlu Evliliğin Sırları",
    description: "Evlilikte iletişim, sabır ve şükür",
    contents: [
      {
        id: "5-1",
        type: "article",
        title: "Evlilikte İletişim",
        body: `Mutlu bir evliliğin temeli sağlıklı iletişimdir:\n\n• Dinlemeyi öğrenmek\n• Empati kurmak\n• Öfke anında susmak\n• Güzel söz söylemek\n• Takdir ve teşekkürü ihmal etmemek\n\nPeygamber Efendimiz (s.a.v.) eşlerine karşı güler yüzlü, nazik ve anlayışlı davranmıştır.`,
      },
    ],
    quiz: [
      {
        id: "q5-1",
        question: "Evlilikte iletişimin en önemli unsuru nedir?",
        options: [
          "Her zaman haklı olmak",
          "Dinlemeyi öğrenmek",
          "Sessiz kalmak",
          "Kararları tek başına almak",
        ],
        correctIndex: 1,
      },
    ],
  },
];

export const mockRequests: MatchRequest[] = [
  {
    id: "r1",
    sender_id: "5",
    receiver_id: "1",
    status: "accepted",
    created_at: "2026-02-15T10:00:00Z",
  },
  {
    id: "r2",
    sender_id: "5",
    receiver_id: "2",
    status: "pending",
    created_at: "2026-02-20T10:00:00Z",
  },
  {
    id: "r3",
    sender_id: "5",
    receiver_id: "3",
    status: "rejected",
    created_at: "2026-02-25T10:00:00Z",
  },
];

// Simulated current user (for demo)
export const currentUser: Profile = {
  id: "5",
  full_name: "Ahmed Bakır",
  age: 30,
  city: "İstanbul",
  profession: "Yazılım Mühendisi",
  bio: "Dinini yaşayan, hayatı birlikte inşa edebileceğim bir eş arıyorum.",
  avatar_url: null,
  gender: "male",
  mezhep: "hanefi",
  namaz_regularity: "5 vakit düzenli",
  education_level: 0,
  created_at: "2026-01-20T10:00:00Z",
};
