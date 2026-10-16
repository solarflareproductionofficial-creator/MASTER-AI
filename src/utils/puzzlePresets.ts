import { LogicPuzzle } from '../types.ts';

export const CLASSIC_LOGIC_PUZZLES: LogicPuzzle[] = [
  {
    id: 'einstein-zebra',
    title: 'Einstein\'ın Zebra Bulmacası',
    category: 'einstein',
    difficulty: 'Üst Düzey',
    description: 'Dünyanın en ünlü mantık bilmecesi. 5 farklı renkte ev, 5 farklı milliyetten insan, farklı içecekler, hayvanlar ve alışkanlıklar. Balığı kim besliyor?',
    clues: [
      'Norveçli ilk evde oturur.',
      'İngiliz kırmızı evde oturur.',
      'Yeşil ev, beyaz evin hemen solundadır.',
      'Yeşil evde oturan kahve içer.',
      'Ortadaki evde oturan süt içer.',
      'Norveçli mavi evin yanında oturur.',
      'Ukraynalı çay içer.',
      'İspanyol köpek besler.'
    ],
    prompt: 'Bana meşhur Einstein/Zebra bulmacasını adım adım çöz: 5 farklı renkte ev, 5 milliyet, 5 içecek ve 5 evcil hayvan var. Balığı kimin beslediğini adım adım gerekçeleri ve çelişki elemesiyle kanıtla.',
    solutionHint: 'Norveçli ve mavi evin konumuyla başla, yeşil ve beyaz ev bitişikliğini süt kuralıyla sınırla.'
  },
  {
    id: 'knights-and-knaves-trio',
    title: 'Şövalyeler, Sahtekarlar ve Ada Paradoksu',
    category: 'knights-knaves',
    difficulty: 'Zor',
    description: 'Adada sadece şövalyeler (hep doğru söyler) ve sahtekarlar (hep yalan söyler) yaşar. Karşılaştığınız iki yerli A ve B hakkında konuşuyor.',
    clues: [
      'A şöyle der: "İkimizden en az biri sahtekardır."',
      'B ise sessizce durur.',
      'A ve B\'nin gerçek kimlikleri nedir?'
    ],
    prompt: 'Bir adada yalnızca hep doğru söyleyen Şövalyeler ve hep yalan söyleyen Sahtekarlar yaşamaktadır. Yerli A: "İkimizden en az biri sahtekardır" der. A ve B\'nin kim olduğunu adım adım formel mantıkla kanıtla.',
    solutionHint: 'A sahtekar olabilir mi hipotezini test et. Eğer sahtekarsa "en az biri sahtekardır" ifadesi doğru mu yanlış mı olur?'
  },
  {
    id: 'river-crossing-wolf-goat',
    title: 'Kurt, Kuzu ve Lahana Nehir Geçişi',
    category: 'river-crossing',
    difficulty: 'Orta',
    description: 'Bir çiftçi nehrin karşısına kurt, kuzu ve bir sandık lahana geçirmek istiyor. Ancak sandalına kendisi dışında yalnızca birini alabiliyor.',
    clues: [
      'Çiftçi yokken Kurt kuzuyu yer.',
      'Çiftçi yokken Kuzu lahanayı yer.',
      'Kurt lahana yemez.'
    ],
    prompt: 'Bir çiftçi nehrin karşısına kurt, kuzu ve bir çuval lahana geçirmek zorundadır. Sandal sadece çiftçiyi ve yanına tek bir nesneyi alabilmektedir. Kurt kuzuyu, kuzu lahanayı yiyebileceğine göre sıfır kayıpla en az kaç hamlede ve hangi sıra ile karşıya geçerler? Adım adım anlat.',
    solutionHint: 'Dönüş hamlelerinde daha önce geçirdiğin bir şeyi geri getirmeyi düşün.'
  },
  {
    id: 'three-light-bulbs',
    title: 'Üç Anahtar ve Üç Lamba',
    category: 'paradox',
    difficulty: 'Orta',
    description: 'Zemin katta 3 elektrik anahtarı var. Üst katta kapalı odada 3 akkor ampul var. Odaya sadece 1 kez girme hakkınız var.',
    clues: [
      'Anahtarların hangisinin hangi lambaya ait olduğunu bulmalısınız.',
      'Odaya sadece tek bir sefer girebilirsiniz.',
      'Dışarıdan odanın içi görünmez.'
    ],
    prompt: 'Alt katta 3 anahtar, üst katta kapalı bir odada 3 ampul var. Odadaki lambaları dışarıdan göremiyorsun ve odaya yalnızca bir kez girme hakkın var. Hangi anahtarın hangi lambayı yaktığını kesin olarak nasıl belirlersin? Adım adım mantığını açıkla.',
    solutionHint: 'Ampullerin sadece ışık yaymadığını, fiziksel başka bir özellik de kazandığını hatırla.'
  },
  {
    id: 'monty-hall-dilemma',
    title: 'Monty Hall Kapı Paradoksu',
    category: 'math',
    difficulty: 'Zor',
    description: 'Önünüzde 3 kapı var: birinin arkasında lüks bir araba, diğer ikisinde keçi var. Bir kapı seçiyorsunuz, sunucu keçi olan bir kapıyı açıyor ve değiştirip değiştirmemek istediğinizi soruyor.',
    clues: [
      '3 kapı var: 1 Araba, 2 Keçi.',
      'Bir kapı seçtiniz (örneğin Kapı 1).',
      'Sunucu Monty arkasında keçi olduğunu bildiği Kapı 3\'ü açıyor.',
      'Seçiminizi Kapı 2 ile değiştirmeli misiniz?'
    ],
    prompt: 'Monty Hall paradoksunu adım adım koşullu olasılık (Bayes teoremi) ile çöz: 3 kapıdan birini seçtikten sonra sunucu keçili bir kapıyı açarsa kapıyı değiştirmek kazanma şansımızı neden %33\'ten %66\'ya çıkarır? Kanıtla.',
    solutionHint: 'İlk seçimde keçiyi seçme olasılığın 2/3\'tür.'
  },
  {
    id: 'cheryls-birthday',
    title: 'Cheryl\'in Doğum Günü Mantık Bilmecesi',
    category: 'math',
    difficulty: 'Üst Düzey',
    description: 'Cheryl yeni arkadaşları Albert ve Bernard\'a doğum gününü bulmaları için 10 olası tarih verir: 15 Mayıs, 16 Mayıs, 19 Mayıs, 17 Haziran, 18 Haziran, 14 Temmuz, 16 Temmuz, 14 Ağustos, 15 Ağustos, 17 Ağustos.',
    clues: [
      'Cheryl Albert\'a ayı, Bernard\'a günü söyler.',
      'Albert: "Doğum gününün ne zaman olduğunu bilmiyorum ama Bernard\'ın da bilmediğini biliyorum."',
      'Bernard: "Önce bilmiyordum ama şimdi biliyorum."',
      'Albert: "O zaman ben de şimdi biliyorum."'
    ],
    prompt: 'Cheryl\'in doğum günü mantık bilmecesini adım adım çöz. Albert ayı, Bernard günü biliyor. Albert "Bernard\'ın bilmediğini biliyorum", ardından Bernard "Şimdi biliyorum", ardından Albert "Ben de şimdi biliyorum" diyor. Doğum günü tam olarak hangi gündür? Epistemik mantıkla adım adım kanıtla.',
    solutionHint: 'Benzersiz günlere (18 ve 19) sahip ayları eleyerek başla.'
  }
];
