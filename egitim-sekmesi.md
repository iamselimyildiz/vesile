"Vesile" projesi için tüm eğitim serisini, mektupları, videoları ve sınav sorularını içeren, veritabanına (NoSQL/JSON) doğrudan aktarabileceğin optimize edilmiş yapı aşağıdadır.

### Vesile Eğitim Müfredatı & Sınav Sistemi Veri Yapısı

```json
{
  "project_name": "Vesile",
  "version": "2.2",
  "curriculum": [
    {
      "module_id": 1,
      "module_title": "Evliliğin Önemi ve Niyet",
      "resources": {
        "letters": [
          {"title": "Evliliğini Geciktirmek İsteyen Gence Mektup", "url": "https://fetvameclisi.com/fetva/evliligini-geciktireyen-gence-mektup"},
          {"title": "Evlilik Bir İbadet Midir?", "url": "https://fetvameclisi.com/fetva/evlilige-niyet-etmek"},
          {"title": "Haram Sevda Kıskacındaki Gence Tavsiyeler", "url": "https://fetvameclisi.com/fetva/haram-sevda-kiskacindaki-gence-mektup"}
        ],
        "videos": [
          {"title": "Evlilik Bir Tercih Değil, Bir Zarurettir", "url": "https://www.youtube.com/watch?v=iJtr25H4ufA"},
          {"title": "Neden Evlenmeliyiz? Hikmetler ve Gayeler", "url": "https://www.youtube.com/watch?v=3A7Qyv-6AtQ"},
          {"title": "Gençlik ve İffet Mücadelesinde Evliliğin Rolü", "url": "https://www.youtube.com/watch?v=Mh99yLNi3zk"}
        ]
      },
      "quiz": [
        {
          "question": "İslam hukukuna göre evliliğin 'ibadet' sayılabilmesi için en temel şart hangisidir?",
          "options": ["Düğün merasiminin gösterişli olması", "İffeti koruma ve salih nesil yetiştirme niyeti", "Maddi imkanların en üst seviyede olması", "Ev eşyalarının eksiksiz olması"],
          "correct_index": 1,
          "hint": "Ameller niyetlere göredir. Herkese ancak niyet ettiği şey vardır.",
          "source": "Buhârî, Bed’ü’l-vahy, 1"
        },
        {
          "question": "Maddi imkansızlık bahanesiyle evliliği erteleyen bir genç neyi ihmal etmiş olur?",
          "options": ["Kariyer fırsatlarını", "Allah’ın vaadine olan tevekkülü", "Kişisel özgürlüğünü", "Sosyal çevresini"],
          "correct_index": 1,
          "hint": "Eğer fakirseler, Allah onları lütfuyla zengin eder.",
          "source": "Nûr Suresi, 32"
        },
        {
          "question": "Evlilik niyetinde 'nesil endişesi' taşımak neyi hedefler?",
          "options": ["Çocuk sayısının çokluğunu", "Miras bırakacak birini bulmayı", "İslam ahlakıyla donanmış kaliteli bir nesil yetiştirmeyi", "Çocukların sadece dünyevi kariyerlerini"],
          "correct_index": 2,
          "hint": "Ölünce insanın ameli kesilir; ancak kendisine dua eden salih evlat müstesna.",
          "source": "Müslim, Vasiyye, 14"
        },
        {
          "question": "Evlenmek hangi durumda 'farz' derecesine çıkar?",
          "options": ["Yaş 30'u geçtiğinde", "Harama düşme ihtimali kesinleştiğinde", "Aile baskısı arttığında", "Maddi birikim tamamlandığında"],
          "correct_index": 1,
          "hint": "Kimin evlenmeye gücü yetiyorsa evlensin. Çünkü evlilik gözü haramdan sakındırır.",
          "source": "Buhârî, Nikâh, 3"
        },
        {
          "question": "İslam'da bekarlık hali nasıl değerlendirilir?",
          "options": ["Saltanattır", "Dinin yarısından mahrum bir korunmasızlık halidir", "Tercihe bağlı üstünlüktür", "Sadece yaşlılıkta zordur"],
          "correct_index": 1,
          "hint": "Kul evlendiği vakit, dininin yarısını tamamlamış olur.",
          "source": "Beyhakî, Şuabü’l-Îmân, 5486"
        }
      ]
    },
    {
      "module_id": 2,
      "module_title": "Mehir, Nikâh ve Düğün Adabı",
      "resources": {
        "letters": [
          {"title": "Mehir Hakkında Bilinmesi Gerekenler", "url": "https://fetvameclisi.com/fetva/578-mehir-nedir-ve-ne-zaman-odenmelidir"},
          {"title": "İslami Bir Düğün Nasıl Olmalı?", "url": "https://fetvameclisi.com/fetva/dugun-adabi-hakkinda"},
          {"title": "Resmi Nikâh ve Sorumluluklar", "url": "https://fetvameclisi.com/fetva/nikah-ve-resmiyet"}
        ],
        "videos": [
          {"title": "Nikâhın Rükünleri ve Şartları", "url": "https://www.youtube.com/watch?v=3A7Qyv-6AtQ"},
          {"title": "Mehir: Kadının Güvencesi", "url": "https://www.youtube.com/watch?v=cKf4YluMOAg"},
          {"title": "Düğünlerdeki İsraf ve Yanlış Adetler", "url": "https://www.youtube.com/watch?v=Mh99yLNi3zk"}
        ]
      },
      "quiz": [
        {
          "question": "Mehir miktarı belirlenirken temel ölçü ne olmalıdır?",
          "options": ["Çok yüksek olmalı", "Erkeği zorlamayacak makul bir miktar", "Sembolik olmalı", "Akrabaların kararı olmalı"],
          "correct_index": 1,
          "hint": "Nikâhın en hayırlısı, külfeti en az olanıdır.",
          "source": "Ebû Dâvûd, Nikâh, 32"
        },
        {
          "question": "Nikâhın ilan edilmesinin (gizli kalmamasının) amacı nedir?",
          "options": ["Takı toplamak", "Nesebin ve kadının haklarının korunması", "Resmi evrak işleri", "Şov yapmak"],
          "correct_index": 1,
          "hint": "Nikâhı ilan edin, onu mescitlerde yapın.",
          "source": "Tirmizî, Nikâh, 6"
        },
        {
          "question": "Düğünlerdeki israfın sınırı nedir?",
          "options": ["Yemek ikramı", "Gösteriş amaçlı ve geleceği borçlandıran harcamalar", "Davetli sayısı", "Müzik kullanımı"],
          "correct_index": 1,
          "hint": "Yiyin, için, giyinin; ancak israfa ve kibre kaçmayın.",
          "source": "Buhârî, Libâs, 1"
        },
        {
          "question": "Ertelenmiş mehir (Müeccel) ne zaman erkeğin üzerine borç olur?",
          "options": ["Hiçbir zaman", "Erkek istediğinde", "Boşanma, ölüm veya kadının talebinde", "Çocuk olduğunda"],
          "correct_index": 2,
          "hint": "Kadınlara mehirlerini gönül rızasıyla verin.",
          "source": "Nisâ Suresi, 4"
        },
        {
          "question": "Düğünlerde mahremiyet sınırı neyi ifade eder?",
          "options": ["Kimsenin çağrılmamasını", "Kadın ve erkeğin harama girmeden eğlendiği ortamı", "Fotoğraf yasağını", "Sadece akraba katılımını"],
          "correct_index": 1,
          "hint": "Mü'min erkeklere ve kadınlara söyle, gözlerini haramdan sakınsınlar.",
          "source": "Nûr Suresi, 30-31"
        }
      ]
    },
    {
      "module_id": 3,
      "module_title": "Görüşme Usulü (Gate Seviyesi)",
      "resources": {
        "letters": [
          {"title": "Evlilik Görüşmesi Yapan Gence Mektup", "url": "https://fetvameclisi.com/fetva/evlilik-gorusmesi-nasil-olmali-diye-soran-musluman-gence-mektup"},
          {"title": "Eş Seçerken Hangi Kriterlere Bakılmalı?", "url": "https://fetvameclisi.com/fetva/es-secimi-kriterleri"},
          {"title": "İstihare ve İstişare Nasıl Yapılır?", "url": "https://fetvameclisi.com/fetva/evlilikte-istihare"}
        ],
        "videos": [
          {"title": "Görüşme Odasında Neler Konuşulur?", "url": "https://www.youtube.com/watch?v=3A7Qyv-6AtQ"},
          {"title": "Adaylarda Aranacak 3 Temel Özellik", "url": "https://www.youtube.com/watch?v=iJtr25H4ufA"},
          {"title": "Nişanlılık Dönemi Hataları", "url": "https://www.youtube.com/watch?v=Mh99yLNi3zk"}
        ]
      },
      "quiz": [
        {
          "question": "Görüşmelerde 'halvet' yasağının sınırı nedir?",
          "options": ["Bakışmak", "Başkası görmeyecek şekilde baş başa kalmak", "Telefonlaşmak", "Mesajlaşmak"],
          "correct_index": 1,
          "hint": "Bir erkek, yanında mahremi olmayan kadınla baş başa kalmasın.",
          "source": "Müslim, Hac, 424"
        },
        {
          "question": "Görüşmeden sadece mesajla evlilik kararı neden risklidir?",
          "options": ["Yavaş ilerler", "Mizaç uyumunu ve simayı görmeyi engellediği için", "Kontör biter", "Aileler kızar"],
          "correct_index": 1,
          "hint": "Evlenmek istediğiniz kadının sizi evliliğe sevk edecek bölgelerine (yüzüne) bakın.",
          "source": "Ebû Dâvûd, Nikâh, 18"
        },
        {
          "question": "İstiharede asıl belirleyici olan nedir?",
          "options": ["Renk görmek", "Kalpteki ferahlık ve işlerin kolaylaşması", "Rakamlar", "Başkasının rüyası"],
          "correct_index": 1,
          "hint": "Allahım! Bu iş dinim ve dünyam için hayırlı ise onu bana kolaylaştır.",
          "source": "Buhârî, Teheccüd, 25"
        },
        {
          "question": "Görüşmede 'yalan söylemek' hangi kapsama girer?",
          "options": ["Basit hata", "Aldatma (Gışş) ve güven yıkımı", "Beyaz yalan", "Strateji"],
          "correct_index": 1,
          "hint": "Bizi aldatan, bizden değildir.",
          "source": "Müslim, Îmân, 164"
        },
        {
          "question": "Veli haberdar olmadan yapılan görüşmelerin riski nedir?",
          "options": ["Pazarlık yapılamaz", "Kızın suistimal edilmesi ve tecrübe eksikliği", "Süre uzar", "Düğün olmaz"],
          "correct_index": 1,
          "hint": "Veli ve iki adil şahit olmadan nikâh geçerli değildir.",
          "source": "Ebû Dâvûd, Nikâh, 19"
        }
      ]
    },
    {
      "module_id": 4,
      "module_title": "Aile Kurma ve Roller",
      "resources": {
        "letters": [
          {"title": "Aile Reisi Olmak İsteyen Erkeğe Mektup", "url": "https://fetvameclisi.com/fetva/aile-reisi-olmak"},
          {"title": "Eşlerin Karşılıklı Hak ve Görevleri", "url": "https://fetvameclisi.com/fetva/eslerin-birbirine-karsi-sorumluluklari"},
          {"title": "Gelin-Kaynana ve Aile İçi Denge", "url": "https://fetvameclisi.com/fetva/aile-ici-denge-ve-mudahaleler"}
        ],
        "videos": [
          {"title": "Kavvam Olmak: Erkeğin Liderliği", "url": "https://www.youtube.com/watch?v=cKf4YluMOAg"},
          {"title": "Saliha Kadının Evdeki Rolü", "url": "https://www.youtube.com/watch?v=Mh99yLNi3zk"},
          {"title": "Ailelerin Müdahalesi Nereye Kadar?", "url": "https://www.youtube.com/watch?v=iJtr25H4ufA"}
        ]
      },
      "quiz": [
        {
          "question": "Erkeğin 'Kavvam' olması ne anlama gelir?",
          "options": ["Sertlik yetkisi", "Yönetme, koruma ve geçim sorumluluğu", "Her kararı tek alma hakkı", "Evden uzak durma"],
          "correct_index": 1,
          "hint": "Erkekler, kadınlar üzerinde kavvâmdır (koruyucudur).",
          "source": "Nisâ Suresi, 34"
        },
        {
          "question": "Kadının kocasına itaati hangi durumda geçerli değildir?",
          "options": ["Maddi isteklerde", "Allah’ın emrine aykırı bir istek olduğunda", "Keyfi durumlarda", "Ailesi istemediğinde"],
          "correct_index": 1,
          "hint": "Allah’a isyan olan konuda kula itaat edilmez.",
          "source": "Müslim, İmâre, 39"
        },
        {
          "question": "Eşlerin birbirine sadakati neleri kapsar?",
          "options": ["Sadece fiziksel sadakat", "Duygusal bağ, sır saklama ve onur koruma", "Şifre paylaşımı", "Aynı evde durma"],
          "correct_index": 1,
          "hint": "Onurlar sizin için bir elbise, siz de onlar için bir elbisesiniz.",
          "source": "Bakara Suresi, 187"
        },
        {
          "question": "Eşlerin ailelerine karşı duruşu nasıl olmalıdır?",
          "options": ["Bağları koparmalı", "Hürmet etmeli ama çekirdek ailenin mahremiyetini korumalı", "Her şeyi sormalı", "Mesafe koymalı"],
          "correct_index": 1,
          "hint": "Büyüklerimize saygı göstermeyen bizden değildir.",
          "source": "Tirmizî, Birr, 15"
        },
        {
          "question": "Ev işleri sadece kadının görevi midir?",
          "options": ["Evet", "Hayır, sorumluluklar paylaşılmalıdır", "Kadın çalışmıyorsa evet", "Erkek isterse evet"],
          "correct_index": 1,
          "hint": "Peygamber Efendimiz evde ailesinin işlerine yardım ederdi.",
          "source": "Buhârî, Ezan, 44"
        }
      ]
    },
    {
      "module_id": 5,
      "module_title": "Mutlu Evliliğin Sırları",
      "resources": {
        "letters": [
          {"title": "Evliliğinde Mutsuz Olanlara Sabır Mektubu", "url": "https://fetvameclisi.com/fetva/mutsuz-evlilik-icin-nasihat"},
          {"title": "Yatak Odası Mahremiyeti ve Sınırları", "url": "https://fetvameclisi.com/fetva/yatak-odasi-mahremiyeti"},
          {"title": "Tartışma ve Geçim Adabı", "url": "https://fetvameclisi.com/fetva/tartisma-ve-gecim-adabi"}
        ],
        "videos": [
          {"title": "Evlilikte İlk Bir Yılın Önemi", "url": "https://www.youtube.com/watch?v=cKf4YluMOAg"},
          {"title": "Mutlu Evlilik İçin 11 Altın Kural", "url": "https://www.youtube.com/watch?v=Mh99yLNi3zk"},
          {"title": "Boşanmaya Götüren Sebepler", "url": "https://www.youtube.com/watch?v=iJtr25H4ufA"}
        ]
      },
      "quiz": [
        {
          "question": "Tartışma anında Müslüman edebi nasıldır?",
          "options": ["Ses yükseltmek", "Ses yükseltmemek ve hakaret etmemek", "Küsmek", "Eski hataları açmak"],
          "correct_index": 1,
          "hint": "Mü'min; kötü söz söyleyen ve lanetleyen biri değildir.",
          "source": "Tirmizî, Birr, 48"
        },
        {
          "question": "Özel mahremiyetin dışarıya anlatılmasının sonucu nedir?",
          "options": ["Arkadaşlık pekişir", "Emanete hıyanet ve büyük günahtır", "Nazar değer", "Deşarj olunur"],
          "correct_index": 1,
          "hint": "Kıyamet günü konumu en kötü olan, eşinin sırrını yayandır.",
          "source": "Müslim, Nikâh, 123"
        },
        {
          "question": "Evlilikte sabır ne demektir?",
          "options": ["Boyun eğmek", "Zorlukları birlikte aşmak ve fevri olmamak", "Sadece erkeğin susması", "Boşanmayı beklemek"],
          "correct_index": 1,
          "hint": "Hoşlanmadığınız bir huyun yanında memnun kalacağınız bir huy mutlaka vardır.",
          "source": "Müslim, Radâ, 61"
        },
        {
          "question": "Eşlerin birbirine teşekkür etmesi neyi ifade eder?",
          "options": ["Nezaket", "Nimetin şükrü ve vefa borcu", "Şımartma", "Formalite"],
          "correct_index": 1,
          "hint": "İnsanlara teşekkür etmeyen, Allah’a da şükretmiş olmaz.",
          "source": "Tirmizî, Birr, 35"
        },
        {
          "question": "Çözülemeyen krizlerde Kur'an'ın tavsiyesi nedir?",
          "options": ["Hemen boşanmak", "Ailelerden hakem tayin etmek", "Mahkemeye gitmek", "Herkesi karıştırmak"],
          "correct_index": 1,
          "hint": "Aranın açılmasından korkarsanız, her iki aileden birer hakem gönderin.",
          "source": "Nisâ Suresi, 35"
        }
      ]
    }
  ]
}

```

**İŞLEM TAMAM**