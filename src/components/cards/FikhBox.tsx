"use client";

import { useState, useEffect } from "react";
import { Profile } from "@/lib/types";

interface FikhBoxProps {
  candidate: Profile;
}

interface FikhEntry {
  text: string;
  source: string;
}

// Pre-generated fıkıh content with inline sources
const fikhContent: Record<string, FikhEntry[][]> = {
  hanefi: [
    [
      {
        text: "Hanefî mezhebine göre evlilik görüşmesinde adayın yüzüne ve ellerine bakmak caizdir.",
        source: "el-Hidâye, Kitâbu'n-Nikâh",
      },
      {
        text: "Görüşme esnasında yanlarında mutlaka bir mahrem bulunmalıdır; yalnız kalmak haramdır.",
        source: "Tirmizî, Radâ' 16/1171",
      },
      {
        text: "Niyetin hâlis olması ve bakışın ölçülü tutulması esastır. Peygamber Efendimiz (s.a.v.) \"Biriniz bir kadınla evlenmek istediğinde, onu evliliğe teşvik eden tarafına bakabilirse baksın\" buyurmuştur.",
        source: "Ebû Dâvûd, Nikâh 18/2082",
      },
    ],
    [
      {
        text: "İmam-ı Azam Ebu Hanife'ye göre nikâhta kadının rızası şarttır; icbar (zorlama) caiz değildir.",
        source: "el-Mebsût, Serahsî, V/2",
      },
      {
        text: "Mehir, kadının en temel hakkıdır. Kur'an-ı Kerim'de \"Kadınlara mehirlerini gönül hoşluğuyla verin\" buyurulmaktadır.",
        source: "Nisâ Sûresi, 4/4",
      },
      {
        text: "Mehir miktarında abartıya kaçmak mekruhtur. \"En hayırlı nikâh, en kolay olanıdır\" hadisi rehberdir.",
        source: "Ebû Dâvûd, Nikâh 32",
      },
    ],
    [
      {
        text: "Hanefî fıkhına göre evlilik kararı öncesi istihare namazı kılmak sünnettir. İki rekât namaz kılınıp Allah'tan hayırlısı istenir.",
        source: "Buhârî, Teheccüd 25/1162",
      },
      {
        text: "Aile büyüklerine danışmak ve istişare etmek de tavsiye edilir. \"İstişare eden pişman olmaz\" buyurulmuştur.",
        source: "Taberânî, el-Mu'cemü'l-Kebîr",
      },
    ],
  ],
  shafii: [
    [
      {
        text: "Şâfiî mezhebine göre nikâhta velinin izni rüknüdür; velisiz nikâh sahih değildir.",
        source: "el-Ümm, İmam Şâfiî, V/13",
      },
      {
        text: "\"Velisinin izni olmadan nikâhlanan kadının nikâhı bâtıldır\" hadisi bu hükmün delilidir.",
        source: "Ebû Dâvûd, Nikâh 19/2083",
      },
      {
        text: "Görüşme sırasında bir mahrem eşliğinde olmak şarttır. Bakış yüz ve ellerle sınırlıdır.",
        source: "Minhâcü't-Tâlibîn, Nevevî",
      },
    ],
    [
      {
        text: "İmam Şâfiî'ye göre adayı görmek sünnettir. Ancak bakış ölçülü olmalı ve mahremiyet korunmalıdır.",
        source: "Müslim, Nikâh 74/1424",
      },
      {
        text: "Görüşmede ciddî ve edepli olmak esastır. Lüzumsuz konuşmalardan kaçınılmalıdır.",
        source: "el-Ezkâr, Nevevî",
      },
    ],
  ],
  maliki: [
    [
      {
        text: "Mâlikî mezhebine göre nikâhta velinin rızası şarttır. Veli bulunmadan akdedilen nikâh fâsittir.",
        source: "el-Müdevvene, İmam Mâlik, II/95",
      },
      {
        text: "Mehr-i misil (emsale uygun mehir) esas alınır. Kadının toplumsal konumuna göre belirlenir.",
        source: "eş-Şerhu'l-Kebîr, Derdîr",
      },
      {
        text: "\"Allah'ın kitabı ile helal olarak aldınız\" ifadesi nikâhın kutsiyetini vurgular.",
        source: "Müslim, Hac 147/1218",
      },
    ],
  ],
  hanbeli: [
    [
      {
        text: "Hanbelî mezhebine göre evlenme niyetiyle adayı görmek caizdir; yüz ve ellere bakmak ile yetinilir.",
        source: "el-Muğnî, İbn Kudâme, VII/74",
      },
      {
        text: "İmam Ahmed bin Hanbel'e göre nikâhta şahitlerin akıl bâliğ, hür ve adaletli olması şarttır.",
        source: "el-İnsâf, Merdâvî, VIII/98",
      },
      {
        text: "Nikâhta açıklık (ilân) sünnettir. Peygamber Efendimiz (s.a.v.) \"Nikâhları ilân ediniz\" buyurmuştur.",
        source: "Tirmizî, Nikâh 6/1089",
      },
    ],
  ],
};

export default function FikhBox({ candidate }: FikhBoxProps) {
  const [entries, setEntries] = useState<FikhEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      const mezContent = fikhContent[candidate.mezhep] || fikhContent.hanefi;
      const randomIndex = Math.floor(Math.random() * mezContent.length);
      setEntries(mezContent[randomIndex]);
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [candidate.mezhep]);

  return (
    <div className="bg-cream-dark/70 border border-gold/15 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <svg className="w-4 h-4 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
        </svg>
        <span className="text-xs font-sans font-semibold text-gold uppercase tracking-wider">
          Fıkıh Penceresi
        </span>
      </div>
      {loading ? (
        <div className="flex items-center gap-2 text-night/30 text-sm">
          <div className="w-4 h-4 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
          İçerik hazırlanıyor...
        </div>
      ) : (
        <div className="space-y-2.5">
          {entries.map((entry, i) => (
            <p key={i} className="text-[13px] text-night/65 leading-relaxed font-sans">
              {entry.text}
              {" "}
              <span className="text-[10px] text-gold/70 italic">
                ({entry.source})
              </span>
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
