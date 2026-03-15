import type { KarneCategory } from "../types";

export const karneCategories: KarneCategory[] = [
  {
    id: "cat1",
    title: "Çocukluk ve Mizaç",
    description: "Adayın çocukluk dönemi ve temel karakter özellikleri",
    questions: [
      { id: "q1", question: "Adayı ne zamandır tanıyorsunuz? Onu en iyi tanımlayan 3 kelime nedir?", type: "text" },
      { id: "q2", question: "Çocukluğunda nasıl bir mizacı vardı? Zor durumlarla nasıl başa çıkardı?", type: "text" },
      { id: "q3", question: "Öfke kontrolü nasıldır? Stresli anlarda nasıl davranır?", type: "text" },
    ],
  },
  {
    id: "cat2",
    title: "Mesleki Yetenekler",
    description: "Adayın iş hayatı ve mesleki yetkinlikleri",
    questions: [
      { id: "q4", question: "Adayın mesleğindeki başarısını ve çalışma disiplinini nasıl değerlendirirsiniz?", type: "text" },
      { id: "q5", question: "Mali sorumluluklarını (borç, tasarruf, harcama) nasıl yönetir?", type: "text" },
    ],
  },
  {
    id: "cat3",
    title: "Fıkhi Hassasiyetler",
    description: "Adayın dini yaşantısı ve hassasiyetleri",
    questions: [
      { id: "q6", question: "Adayın namaz, oruç ve diğer ibadetlere düzenli devam durumu nedir?", type: "text" },
      { id: "q7", question: "Helal-haram hassasiyeti günlük hayatına ne ölçüde yansıyor?", type: "text" },
      { id: "q8", question: "Dini bilgisini geliştirmek için neler yapıyor?", type: "text" },
    ],
  },
  {
    id: "cat4",
    title: "Sosyal Vefa",
    description: "Adayın sosyal ilişkileri ve vefa duygusu",
    questions: [
      { id: "q9", question: "Aile bağları nasıl? Anne-babası ve kardeşleriyle ilişkisi nasıl?", type: "text" },
      { id: "q10", question: "Arkadaşlık ilişkilerinde ne kadar vefalıdır?", type: "text" },
      { id: "q11", question: "Komşuluk ve toplumsal yardımlaşma konusunda nasıl davranır?", type: "text" },
    ],
  },
];
