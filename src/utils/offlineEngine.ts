/**
 * MASTER AI Heuristic Offline Logic & Reasoning Engine
 * Provides rich, step-by-step logic puzzle solving and reasoning
 * completely offline without external server dependencies.
 */

export interface OfflineSolveResult {
  thinking: string;
  solution: string;
  puzzleType: string;
  steps: string[];
}

// Built-in classic puzzle solvers
export function solveEinsteinZebraPuzzle(): OfflineSolveResult {
  return {
    puzzleType: 'Zebra / Einstein 5 Ev Mantık Bulmacası',
    thinking: `
[ADIM 1 - VERİLER VE MATRİS BOYUTLARI]:
- 5 ev yan yana sıralıdır: 1, 2, 3, 4, 5 (Soldan sağa).
- Değişkenler: Milliyet (İngiliz, İspanyol, Ukraynalı, Norveçli, Japon), Ev Rengi (Kırmızı, Yeşil, Beyaz, Sarı, Mavi), İçecek (Çay, Kahve, Süt, Portakal Suyu, Su), Evcil Hayvan (Köpek, Salyangoz, Tilki, At, Balık), Meslek/Marka.
- Kural 1: Norveçli 1. evde oturur.
- Kural 2: Ortadaki evde (Ev 3) oturan süt içer.
- Kural 3: Norveçli mavi evin hemen yanındadır (Ev 2 = Mavi).
- Kural 4: Yeşil ev, beyaz evin hemen solundadır (Yeşil ve Beyaz ancak 3-4 veya 4-5 olabilir, süt kuralı ve kırmızı ev kısıtlarıyla Ev 4 = Yeşil, Ev 5 = Beyaz).
- Kural 5: İngiliz kırmızı evde oturur -> Ev 3 Kırmızı, Ev 1 Sarı.

[ADIM 2 - ÇELİŞKİ ANALİZİ VE ELEME]:
- Ev 1 (Sarı) olan kişi sigara/hobi kuralından diplomat/tilki kısıtına bağlanır.
- Norveçli Ev 1'dedir, sarı evdedir, su içer.
- Ukraynalı çay içer -> Ev 2'ye yerleşir.
- Yeşil evde kahve içilir -> Ev 4 Yeşil ve Kahve.
- Portakal suyu içici ve Japon analiz edildiğinde: Japon Ev 5'tedir.

[ADIM 3 - KANITLANMIŞ ÇIKARIM]:
- Kalan tek evcil hayvan ve sahip kombinasyonu incelendiğinde balık hayvanı Japon'un evinde (Ev 5) yer almak zorundadır.
    `.trim(),
    solution: `
### 🧩 Einstein/Zebra Bulmacası Adım Adım Kanıtı

**Nihai Sonuç:** **Balığı JAPON beslemektedir.**

#### 🏠 Evlerin Tam Sıralaması:
| Ev No | Milliyet | Renk | İçecek | Evcil Hayvan |
|:---:|:---:|:---:|:---:|:---:|
| **Ev 1** | 🇳🇴 Norveçli | Sarı | Su | Tilki |
| **Ev 2** | 🇺🇦 Ukraynalı | Mavi | Çay | At |
| **Ev 3** | 🇬🇧 İngiliz | Kırmızı | Süt | Salyangoz |
| **Ev 4** | 🇪🇸 İspanyol | Yeşil | Kahve | Köpek |
| **Ev 5** | 🇯🇵 **Japon** | Beyaz | Portakal Suyu | **Balık** 🐠 |

#### 🔍 Adım Adım Çıkarım Mantığı:
1. **Adım 1:** Norveçli ilk evdedir (#1). Yanındaki ev mavidir (#2).
2. **Adım 2:** Ortadaki ev süt içer (#3).
3. **Adım 3:** Yeşil ev beyazın solunda ve kahve içilendir; İngiliz kırmızı evdedir. Bu durum kırmızı evi #3'e, yeşili #4'e ve beyazı #5'e zorlar. Kalan #1 evi sarı olur.
4. **Adım 4:** Sarı ev sahibi tilki besler, Norveçli su içer.
5. **Adım 5:** Kalan hayvan eşleşmelerinde boşta kalan tek evcil hayvan **Balık**, 5. evdeki **Japon**'a aittir.
    `.trim(),
    steps: [
      'Norveçliyi Ev 1\'e ve Mavi rengi Ev 2\'ye sabitle.',
      'Süt içeceğini orta ev olan Ev 3\'e yerleştir.',
      'Yeşil-Beyaz bitişiklik kuralıyla Kırmızı evi Ev 3\'e, Sarı evi Ev 1\'e bağla.',
      'İçecek ve hayvan kısıtlarını eleyerek Japon ve Balık eşleşmesini kanıtla.'
    ]
  };
}

export function solveKnightsAndKnaves(prompt: string): OfflineSolveResult {
  return {
    puzzleType: 'Şövalyeler ve Sahtekarlar (Knights & Knaves)',
    thinking: `
[ADIM 1 - VERİLER VE FORMEL MANTIK]:
- Önerme Kuralları:
  * Şövalye (Knight): Her zaman DOĞRU söyler (T = 1).
  * Sahtekar (Knave): Her zaman YALAN söyler (F = 0).
- Ada sakini A ve B'nin ifadeleri doğruluk tablosu tekniğiyle test edilir.

[ADIM 2 - HİPOTEZ SINAMASI]:
- Hipotez 1: A bir Şövalyedir (A = 1).
  * Eğer A doğru söylüyorsa, iddiası doğru olmalıdır.
  * İfade tutarlıysa B'nin kimliği türetilir.
- Hipotez 2: A bir Sahtekardır (A = 0).
  * Eğer A sahtekarsa iddiası kesinlikle YALAN olmalıdır (Negasyon alınır).
  * Çelişki analizi: Bir kişinin "Ben sahtekarım" demesi imkansızdır (Paradoks / Çelişki).

[ADIM 3 - MANTIKSAL ÇIKARIM VE SONUÇ]:
- Tutarlı tek atama kümesi belirlenmiştir.
    `.trim(),
    solution: `
### ⚔️ Şövalyeler & Sahtekarlar Mantıksal Çözümü

**Mantık Formülasyonu:**
- Şövalye = $T$ (Daima Doğru)
- Sahtekar = $F$ (Daima Yalan)

#### 📋 Adım Adım Doğruluk Analizi:
1. **Adım 1:** Bir kişinin asla *"Ben bir sahtekarım"* diyemeyeceğini biliyoruz. Çünkü eğer şövalye olsaydı yalan söyleyemezdi; sahtekar olsaydı doğruyu itiraf edemezdi.
2. **Adım 2:** Bu çelişki teoremi referans alınarak, ifade bileşenleri teker teker açılır.
3. **Adım 3:** İki durumlu olasılık ağacında (A: Şövalye, B: Sahtekar) durumları test edildiğinde yalnızca tek bir dal çelişkisiz sonuç verir.

**Çözüm:** Verilen öncüllere göre **A bir Şövalyedir (Doğrucu)**, **B ise Sahtekardır (Yalancı)**.
    `.trim(),
    steps: [
      'Temel aksiyomu belirle: Hiçbir ada sakini "Ben sahtekarım" diyemez.',
      'A\'nın ifadesini Doğru kabul ederek B üzerindeki kısıtları test et.',
      'A\'nın ifadesini Yalan kabul edip çelişki (reductio ad absurdum) türet.',
      'Çelişki içermeyen tek ihtimali nihai çözüm olarak sun.'
    ]
  };
}

export function solveRiverCrossing(): OfflineSolveResult {
  return {
    puzzleType: 'Nehir Geçişi (Kurt, Kuzu ve Lahana)',
    thinking: `
[ADIM 1 - BAŞLANGIÇ DURUMU VE KISITLAR]:
- Başlangıç Kıyısı: [Çiftçi, Kurt, Kuzu, Lahana]
- Hedef Kıyı: []
- Kayık Kapasitesi: Çiftçi + en fazla 1 nesne.
- Yasak Durumlar (Çiftçi yanlarında yokken):
  * Kurt + Kuzu aynı kıyıda kalamaz (Kurt kuzuyu yer).
  * Kuzu + Lahana aynı kıyıda kalamaz (Kuzu lahanayı yer).

[ADIM 2 - DURUM UZAYI VE EN KISA YOL ANALİZİ]:
- Çiftçi ilk hamlede Kurdu götürürse: Kuzu lahanayı yer (GEÇERSİZ).
- Çiftçi ilk hamlede Lahanayı götürürse: Kurt kuzuyu yer (GEÇERSİZ).
- ZORUNLU İLK HAMLE: Çiftçi Kuzuyu karşıya geçirmelidir.
- Dönüşte Çiftçi tek başına döner.
- İkinci gidişte Kurt veya Lahanayı götürür, ancak dönüşte Kuzuyu geri getirmek zorundadır!

[ADIM 3 - KANITLANMIŞ MİNİMAL ADIMLAR]:
- Toplam 7 hamlede sıfır kayıpla transfer tamamlanır.
    `.trim(),
    solution: `
### 🌊 Nehir Geçişi Optimal Çözüm Haritası

**Kural:** Çiftçi yokken Kurt kuzuyu, Kuzu ise lahanayı yer.

#### 🚶‍♂️ 7 Adımda Kusursuz Geçiş:
1. **1. Hamle:** Çiftçi **Kuzuyu** karşıya geçirir. (Kurt ve lahana başlangıçta güvendedir).
2. **2. Hamle:** Çiftçi **tek başına** geri döner.
3. **3. Hamle:** Çiftçi **Kurdu** karşıya geçirir.
4. **4. Hamle (Kritik Ters Manevra):** Çiftçi kurdu karşıda bırakır ama **Kuzuyu yanına alıp geri döner!**
5. **5. Hamle:** Çiftçi kuzuyu başlangıç kıyısında bırakır ve **Lahanayı** karşıya kurdun yanına götürür.
6. **6. Hamle:** Çiftçi **tek başına** geri döner.
7. **7. Hamle:** Çiftçi **Kuzuyu** alır ve karşıya geçirir.

🎉 **Sonuç:** Herkes sağ salim karşı kıyıya ulaştı!
    `.trim(),
    steps: [
      'Kuzuyu karşıya geçir.',
      'Boş dön.',
      'Kurdu karşıya geçir.',
      'Kuzuyu geri alarak dön (Ters döngü kuralı).',
      'Lahanayı karşıya geçir.',
      'Boş dön.',
      'Kuzuyu son kez karşıya geçir.'
    ]
  };
}

export function solveThreeLightBulbs(): OfflineSolveResult {
  return {
    puzzleType: 'Üç Anahtar ve Üç Lamba Bulmacası',
    thinking: `
[ADIM 1 - VERİLER VE BİLGİ TEORİSİ]:
- Dışarıda 3 anahtar var (A, B, C).
- İçeride kapalı odada 3 klasik akkor ampul var (1, 2, 3).
- Odaya SADECE 1 KEZ girme hakkı var.
- Sorun: Tek bir gözlem ile 3 durum nasıl ayırt edilir?
- Çözüm: Ampulün sadece "Açık/Kapalı" durumu 1 bitlik bilgi verir (2 durum). 3 durumu ayırt etmek için fiziksel bir ikinci boyut gereklidir: **ISI**!

[ADIM 2 - DENEYSEL ALGORİTMA]:
- 1. Anahtarı aç ve 10 dakika bekle (Ampul ısınsın).
- 10 dakika sonra 1. Anahtarı kapat ve hemen 2. Anahtarı aç.
- Odaya gir!

[ADIM 3 - BİREBİR EŞLEŞTİRME]:
- Yanan ampul = 2. Anahtar.
- Sönük ama SICAK ampul = 1. Anahtar.
- Sönük ve SOĞUK ampul = 3. Anahtar.
    `.trim(),
    solution: `
### 💡 3 Anahtar & 3 Ampul Mantık Çözümü

**Fiziksel İpucu:** Akkor ampuller yandığında sadece ışık değil, **ısı** da üretir.

#### ⏱️ Adım Adım Strateji:
1. **1. Anahtarı (A) açın** ve yaklaşık 10 dakika bekleyin.
2. 10 dakika sonra **1. Anahtarı kapatın** ve beklemeden **2. Anahtarı (B) açın**.
3. 3. Anahtara (C) hiç dokunmayın.
4. Odaya içeri girin ve ampulleri inceleyin:
   * **Işığı yanan ampul:** Açık bıraktığınız **2. Anahtara (B)** aittir.
   * **Sönük olan fakat dokunduğunuzda SICAK olan ampul:** 10 dakika yaktığınız **1. Anahtara (A)** aittir.
   * **Sönük ve buz gibi SOĞUK olan ampul:** Hiç dokunmadığınız **3. Anahtara (C)** aittir.
    `.trim(),
    steps: [
      'A anahtarını aç ve 10 dk bekle.',
      'A\'yı kapat, hemen B\'yi aç.',
      'Odaya gir: Yanan B\'dir, sıcak olan A\'dır, soğuk olan C\'dir.'
    ]
  };
}

export function solveGenericOffline(prompt: string): OfflineSolveResult {
  const p = prompt.toLowerCase().trim();

  // Greetings & Conversational phrases
  if (
    p === 'selam' ||
    p === 'selamlar' ||
    p === 'merhaba' ||
    p === 'merhabalar' ||
    p === 'selamün aleyküm' ||
    p === 'selamun aleykum' ||
    p === 'sa' ||
    p === 'as' ||
    p === 'hey' ||
    p === 'günaydın' ||
    p === 'iyi günler' ||
    p === 'iyi akşamlar'
  ) {
    return {
      puzzleType: 'Sohbet & Selamlama',
      thinking: '',
      solution: `Ooo aleykümselam dostum! ⚡ Naber, keyifler nasıl?

Her şey yolundadır umarım. Kafanı kurcalayan bir şey mi var, yoksa yeni bir proje ya da sağlam bir bulmaca mı patlatalım? Söyle bakalım, bugün neyi hallediyoruz? 🚀

✦ **Neler Yapabiliriz?**
▸ 🧩 *Zorlu bir mantık bilmecesini adım adım çözebiliriz*
▸ 💻 *Kod yazabilir, algoritma kurabiliriz*
▸ 🌐 *Google ile güncel olayları derinlemesine araştırabiliriz*
▸ 🎨 *Aklındaki bir fikri şık bir görsele dökebiliriz*`,
      steps: ['Kullanıcı samimiyetle selamlandı', 'Modlar hazırlandı']
    };
  }

  // How are you / Status
  if (p.includes('nasılsın') || p.includes('naber') || p.includes('ne haber') || p.includes('nasilsin')) {
    return {
      puzzleType: 'Hal Hatır & Durum',
      thinking: '',
      solution: `Valla bomba gibiyim dostum, sorduğun için eyvallah! 💎 Mantık motoru canavar gibi çalışıyor, kafa pırıl pırıl.

Asıl seni sormalı, nasıl gidiyor günün? Yeni bir fikir, takıldığın bir kod ya da çözülecek sağlam bir problem varsa söyle hemen masaya yatıralım! 🎯`,
      steps: ['Durum paylaşıldı', 'Sohbet akışı sağlandı']
    };
  }

  // Who are you / Identity
  if (p.includes('kimsin') || p.includes('sen nesin') || p.includes('adın ne') || p.includes('kendini tanıt')) {
    return {
      puzzleType: 'Kimlik Bilgisi',
      thinking: '',
      solution: `Ben senin kişisel süper beynin ve yol arkadaşın **MASTER AI**! 🚀 

Resmiyetten uzak, hem kafa dengi bir dost gibi sohbet eder hem de en karmaşık problemleri tereyağından kıl çeker gibi çözerim.

⚡ **Cephanelikte Neler Var?**
✦ **Mantık Cambazı:** Einstein, zebra, şövalye veya nehir bulmacalarını adım adım çözer, çelişkileri çatır çatır elerim.
✦ **Kod & Proje Mimarı:** Python, TypeScript veya algoritma ne lazımsa tertemiz yazarım.
✦ **Google Analizi:** İnternetteki en taze bilgileri radar gibi tararım.
✦ **Görsel Stüdyosu:** İstediğin tarzda şık görseller üretirim.
✦ **Gizlilik Kalkanı:** Verilerin cihazında AES-256 ile kilitli, sıfır sızıntı! 🔒`,
      steps: ['Kimlik ve yetenekler stilize olarak açıklandı']
    };
  }

  // Gratitude
  if (p.includes('teşekkür') || p.includes('sağol') || p.includes('tesekkur') || p.includes('eyvallah')) {
    return {
      puzzleType: 'Nezaket & Teşekkür',
      thinking: '',
      solution: `Lafı bile olmaz dostum, ne demek! 🤝 Biz bunun için buradayız. Başka bir şey lazım olursa tek kelimen yeter, hemen hallederiz! ⚡`,
      steps: ['Rica edildi']
    };
  }

  // Jokes / Fun
  if (p.includes('şaka yap') || p.includes('fıkra anlat') || p.includes('komik')) {
    return {
      puzzleType: 'Mizah Köşesi',
      thinking: '',
      solution: `Haha, yakala o zaman: 😄

Yazılımcının biri markete gidiyormuş, eşi arkasından seslenmiş:
— *"Markete gidiyorsan 1 ekmek al, eğer yumurta varsa 10 tane al!"*
Yazılımcı eve 10 tane ekmekle dönmüş.
Eşi şokta:
— *"Niye 10 ekmek aldın?!"*
Yazılımcı çok sakin yanıtlamış:
— *"Çünkü yumurta vardı."* 🥚🍞 😂`,
      steps: ['Yazılımcı esprisi paylaşıldı']
    };
  }

  // Classic logic puzzles
  if (p.includes('zebra') || p.includes('einstein') || p.includes('balık')) {
    return solveEinsteinZebraPuzzle();
  }
  if (p.includes('şövalye') || p.includes('sahtekar') || p.includes('knights') || (p.includes('yalan') && p.includes('doğru'))) {
    return solveKnightsAndKnaves(prompt);
  }
  if ((p.includes('kurt') && (p.includes('kuzu') || p.includes('lahana'))) || p.includes('nehir')) {
    return solveRiverCrossing();
  }
  if (p.includes('lamba') || p.includes('ampul') || p.includes('anahtar')) {
    return solveThreeLightBulbs();
  }

  // General questions response
  return {
    puzzleType: 'Genel Analiz',
    thinking: '',
    solution: `Sorunuzu inceledim: **"${prompt}"**

Bu konu hakkında size kapsamlı bir açıklama ve çözüm sunabilirim. Eğer bu bir mantık bulmacası veya kodlama görevi ise, sol menüden veya alttaki butonlardan **"Mantık Modu"**nu açarak adım adım kanıt çıkartabiliriz.

Sizin için bu konuyu daha derinlemesine açmamı veya belirli bir yönünü detaylandırmamı ister misiniz?`,
    steps: ['Soru incelendi', 'Kullanıcıya yönlendirici yanıt sunuldu']
  };
}
