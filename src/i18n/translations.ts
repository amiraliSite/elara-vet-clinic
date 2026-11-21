import type { ClinicImageKey } from '../data/clinicMedia';

export type Language = 'fa' | 'en';

export type CameraPreset = 'overview' | 'companions' | 'diagnostics' | 'lamp';
export type LightingMood = 'daylight' | 'evening';
export type HotspotId = 'companions' | 'monitor' | 'table' | 'lamp';
export type GalleryFilter = 'all' | 'canine' | 'feline' | 'team';

export interface HeroSlideItem {
  id: string;
  imageKey: ClinicImageKey;
  title: string;
  subtitle: string;
  tag: string;
}

export interface TranslationBundle {
  langLabel: string;
  dir: 'ltr' | 'rtl';
  brand: string;
  nav: {
    sanctuary: string;
    explorer3d: string;
    specialties: string;
    gallery: string;
    book: string;
  };
  hero: {
    kicker: string;
    title: string;
    motto: string;
    subtitle: string;
    primaryCta: string;
    secondaryCta: string;
    autoPlayOn: string;
    autoPlayOff: string;
    prevSlide: string;
    nextSlide: string;
    slideHint: string;
    slides: HeroSlideItem[];
  };
  explorer: {
    kicker: string;
    title: string;
    subtitle: string;
    dragHint: string;
    fallbackTitle: string;
  };
  dock: {
    hideControls: string;
    showControls: string;
    viewsLabel: string;
    views: Record<CameraPreset, string>;
    explodeLabel: string;
    moodLabel: string;
    moods: Record<LightingMood, string>;
    hotspots: Record<
      HotspotId,
      {
        title: string;
        detail: string;
      }
    >;
    inspectHint: string;
  };
  philosophy: {
    kicker: string;
    title: string;
    body: string;
    quote: string;
    imageCaption: string;
    metrics: {
      value: string;
      label: string;
    }[];
  };
  specialties: {
    kicker: string;
    title: string;
    subtitle: string;
    items: {
      num: string;
      title: string;
      description: string;
      detail: string;
      imageKey?: 'diagnostics' | 'surgery';
    }[];
  };
  gallery: {
    kicker: string;
    title: string;
    subtitle: string;
    filters: Record<GalleryFilter, string>;
    cards: {
      id: string;
      category: Exclude<GalleryFilter, 'all'>;
      imageKey: ClinicImageKey;
      title: string;
      meta: string;
      description: string;
      wide?: boolean;
    }[];
  };
  booking: {
    kicker: string;
    title: string;
    subtitle: string;
    highlights: {
      title: string;
      text: string;
    }[];
    form: {
      speciesLabel: string;
      species: {
        dog: string;
        cat: string;
        exotic: string;
      };
      petNameLabel: string;
      petNamePlaceholder: string;
      serviceLabel: string;
      services: string[];
      dateLabel: string;
      timeLabel: string;
      timeSlots: string[];
      ownerNameLabel: string;
      ownerNamePlaceholder: string;
      contactLabel: string;
      contactPlaceholder: string;
      notesLabel: string;
      notesPlaceholder: string;
      submitBtn: string;
      errorRequired: string;
      errorContact: string;
      successTitle: string;
      successBody: string;
      refLabel: string;
      newRequestBtn: string;
    };
  };
  feedback: {
    kicker: string;
    title: string;
    subtitle: string;
    ratingLabels: string[];
    commentLabel: string;
    commentPlaceholder: string;
    submitBtn: string;
    laterBtn: string;
    closeAria: string;
    selectStarError: string;
    thanksTitle: string;
    thanksBody: string;
  };
  footer: {
    tagline: string;
    hoursTitle: string;
    hoursDetail: string;
    emergencyDetail: string;
    locationsTitle: string;
    locationsDetail: string;
    languageTitle: string;
    copyright: string;
  };
}

export const TRANSLATIONS: Record<Language, TranslationBundle> = {
  fa: {
    langLabel: 'فارسی',
    dir: 'rtl',
    brand: 'کلینیک الارا',
    nav: {
      sanctuary: 'گالری سه‌بعدی',
      explorer3d: 'اتاق معاینه',
      specialties: 'تخصص‌ها',
      gallery: 'فضاها',
      book: 'رزرو نوبت',
    },
    hero: {
      kicker: 'کلینیک تخصصی حیوانات خانگی · تهران و مونیخ',
      title: 'مهرِ بی‌مرز و دقتِ پزشکی در پناهگاه آرامِ الارا',
      motto: '«هر نفسِ آرامِ این یارانِ بی‌زبان، امانتی است در دستانِ علم و مهربانی»',
      subtitle:
        'تلفیق معماری روشن و آفتابی، سنگ تراورتن گرم، تصویربرداری دقیق و بخش‌های کاملاً مجزای سگ و گربه برای تجربه‌ای شاد و بدون استرس.',
      primaryCta: 'رزرو مشاوره تخصصی',
      secondaryCta: 'کاوش سه‌بعدی اتاق معاینه',
      autoPlayOn: 'پخش خودکار فعال',
      autoPlayOff: 'توقف اسلایدر',
      prevSlide: 'اسلاید قبلی',
      nextSlide: 'اسلاید بعدی',
      slideHint: 'موس را حرکت دهید برای عمق سه‌بعدی · هر ۴ ثانیه تغییر خودکار عکس',
      slides: [
        {
          id: 'atrium',
          imageKey: 'hero',
          title: 'آتریوم نورگیر و پذیرش آرامش‌بخش الارا',
          subtitle: 'دیوارهای سنگ تراورتن آکوستیک و باغچه داخلی برای کاهش فوری استرس ورود.',
          tag: '۰۱ · معماری کلینیک',
        },
        {
          id: 'diagnostics',
          imageKey: 'diagnostics',
          title: 'سوئیت تصویربرداری ام‌آرآی و سونوگرافی داپلر',
          subtitle: 'تجهیزات تیتانیومی بی‌صدا با نورپردازی غیرمستقیم و دقت تشخیصی بالا.',
          tag: '۰۲ · تشخیص دقیق',
        },
        {
          id: 'surgery',
          imageKey: 'surgery',
          title: 'اتاق میکروجراحی استریل و دندانپزشکی',
          subtitle: 'میکروسکوپ جراحی دقیق، پایش بیهوشی اختصاصی و ایمنی کامل بیمار.',
          tag: '۰۳ · جراحی ظریف',
        },
        {
          id: 'canine',
          imageKey: 'dog',
          title: 'لانژ تخصصی و بدون تنش سگ‌ها',
          subtitle: 'فضای نورانی با نیمکت‌های سنگی گرم؛ بدون قفس‌های سرد و پراسترس.',
          tag: '۰۴ · بخش سگ‌ها',
        },
        {
          id: 'feline',
          imageKey: 'cat',
          title: 'سوئیت اختصاصی و عایق‌صدای گربه‌ها',
          subtitle: 'کوسن‌های کتان لطیف و دیفیوزر فرمون آرام‌بخش ویژه گربه‌های حساس.',
          tag: '۰۵ · بخش گربه‌ها',
        },
        {
          id: 'specialists',
          imageKey: 'team',
          title: 'معاینه تیمی و صبورانه متخصصان',
          subtitle: 'بررسی هم‌زمان توسط دامپزشکان متخصص داخلی و قلب بدون عجله.',
          tag: '۰۶ · تیم پزشکی',
        },
      ],
    },
    explorer: {
      kicker: 'اتاق معاینه تعاملی سه‌بعدی',
      title: 'محیط درمان را پیش از مراجعه، سه‌بعدی لمس کنید',
      subtitle:
        'مدل سه‌بعدی اتاق معاینه الارا را بچرخانید، لایه‌های تجهیزات را تفکیک کنید و وضعیت مانیتور علائم حیاتی را از نزدیک ببینید.',
      dragHint: 'برای چرخش بکشید · اسکرول برای بزرگ‌نمایی · کلیک روی بخش‌های سه‌بعدی',
      fallbackTitle: 'نمای کلینیک تخصصی الارا',
    },
    dock: {
      hideControls: 'بستن کنترل‌ها',
      showControls: 'نمایش کنترل‌های سه‌بعدی',
      viewsLabel: 'زاویه دید',
      views: {
        overview: 'نمای کلی',
        companions: 'بخش بیماران',
        diagnostics: 'علائم حیاتی',
        lamp: 'چراغ جراحی',
      },
      explodeLabel: 'تفکیک لایه‌ها',
      moodLabel: 'نورپردازی',
      moods: {
        daylight: 'نور روز',
        evening: 'بخش شبانه',
      },
      hotspots: {
        companions: {
          title: 'بخش آرامش و بدون استرس بیماران',
          detail: 'کوسن‌های کتان آکوستیک ضربان قلب سگ و گربه را پیش از معاینه تا ۳۲٪ آرام‌تر نگه می‌دارند.',
        },
        monitor: {
          title: 'مانیتورینگ دقیق علائم حیاتی',
          detail: 'ثبت پیوسته نوار قلب، سطح اکسیژن خون و فشار خون داپلر با دقت بیمارستانی.',
        },
        table: {
          title: 'میز معاینه سنگ تراورتن گرمایشی',
          detail: 'تنظیم ارتفاع هیدرولیک بدون لرزش همراه با سطح سرامیکی گرم‌شده تا دمای ۳۸.۲ درجه.',
        },
        lamp: {
          title: 'چراغ جراحی بدون سایه با نور ملایم',
          detail: 'طیف نوری گرم‌ملایم طراحی‌شده برای جلوگیری از خستگی و خیرگی چشم حیوانات.',
        },
      },
      inspectHint: 'برای مشاهده جزئیات بالینی، روی هر بخش در صحنه سه‌بعدی کلیک کنید.',
    },
    philosophy: {
      kicker: 'معماری درمانی بدون تنش',
      title: 'دامپزشکی تخصصی به دور از اضطراب محیط‌های درمانی',
      body: 'تک‌تک جزئیات کلینیک تخصصی الارا — از فضای پرنور و آفتابی با سنگ تراورتن جاذب صدا و چوب گرم تا بخش‌های کاملاً تفکیک‌شده سگ‌ها و گربه‌ها — برای ایجاد حس شادی، امنیت و آرامش پیش از شروع معاینه طراحی شده‌اند.',
      quote: '«آرامشِ جانِ پناهجو، نیمی از درمان است»',
      imageCaption: 'لابی اصلی کلینیک · سنگ تراورتن آکوستیک و پذیرش مجزای سگ و گربه',
      metrics: [
        { value: '۲۴/۷', label: 'مراقبت ویژه و اورژانس' },
        { value: 'زیر ۱۲ دقیقه', label: 'پاسخ آزمایشگاه داخلی' },
        { value: '۴۲ دسی‌بل', label: 'استاندارد سکوت محیطی' },
        { value: '۳ بخش', label: 'سوئیت تصویربرداری تخصصی' },
      ],
    },
    specialties: {
      kicker: 'دپارتمان‌های تخصصی',
      title: 'تشخیص دقیق و جراحی‌های کم‌تهاجمی با استاندارد روز',
      subtitle:
        'در هر دپارتمان، پیشرفته‌ترین تجهیزات تصویربرداری و جراحی در کنار ویزیت‌های صبورانه و بدون عجله قرار می‌گیرند.',
      items: [
        {
          num: '۰۱.',
          title: 'تصویربرداری تشخیصی و سونوگرافی داپلر',
          description:
            'تصویربرداری ام‌آرآی تخصصی حیوانات، سی‌تی‌اسکن کم‌دوز و اکوکاردیوگرافی رنگی قلب بدون نیاز به مهار فیزیکی پراسترس.',
          detail: 'گزارش رادیولوژیست در همان روز · آرشیو دیجیتال تصاویر',
          imageKey: 'diagnostics',
        },
        {
          num: '۰۲.',
          title: 'میکروجراحی کم‌تهاجمی و دندانپزشکی',
          description:
            'جراحی‌های لاپاراسکوپی بافت نرم، رادیوگرافی دیجیتال دندان و جراحی‌های ظریف زیر میکروسکوپ در اتاق عمل استریل.',
          detail: 'حضور متخصص بیهوشی دامپزشکی در تمام عمل‌ها',
          imageKey: 'surgery',
        },
        {
          num: '۰۳.',
          title: 'بخش اختصاصی طب داخلی و کلیوی گربه‌ها',
          description:
            'اتاق‌های معاینه با دیفیوزر فرمون آرام‌بخش ویژه گربه‌ها؛ بدون صدای پارس سگ، با میزهای گرم و مراقبت تخصصی سالمندان.',
          detail: 'منطبق با استاندارد طلایی کلینیک دوستدار گربه',
        },
        {
          num: '۰۴.',
          title: 'قلب‌وعروق، ارتوپدی و طول عمر سالمندان',
          description:
            'اکوکاردیوگرافی پیشگیرانه، توان‌بخشی مفاصل و برنامه تغذیه بالینی اختصاصی برای افزایش کیفیت زندگی سگ‌ها و گربه‌های مسن.',
          detail: 'چکاپ جامع شاخص‌های سلامت هر ۶ ماه',
        },
      ],
    },
    gallery: {
      kicker: 'فضاهای داخلی کلینیک',
      title: 'مراقبت محترمانه در فضایی آرام و روشن',
      subtitle:
        'فضاهای درمانی و اتاق‌های آرامش کلینیک را بر اساس نیاز حیوان خانگی خود بررسی کنید.',
      filters: {
        all: 'همه فضاها',
        canine: 'بخش سگ‌ها',
        feline: 'بخش گربه‌ها',
        team: 'تیم تخصصی',
      },
      cards: [
        {
          id: 'dog-lounge',
          category: 'canine',
          imageKey: 'dog',
          title: 'سالن انتظار آرام سگ‌ها با نور طبیعی',
          meta: 'بخش سگ‌ها · طبقه همکف',
          description: 'نیمکت‌های سنگی گرم و نور طبیعی جایگزین قفس‌های سرد فلزی انتظار شده‌اند.',
        },
        {
          id: 'cat-room',
          category: 'feline',
          imageKey: 'cat',
          title: 'اتاق ایزوله و ساکت ویژه گربه‌ها',
          meta: 'بخش گربه‌ها · عایق صدا',
          description: 'کوسن‌های کتان لطیف و پنجره‌های رو به باغچه برای معاینه‌ای آرام و بی‌تنش.',
        },
        {
          id: 'team-care',
          category: 'team',
          imageKey: 'team',
          title: 'کمیسیون و معاینه تیمی متخصصان',
          meta: 'طب داخلی · قلب‌وعروق',
          description: 'معاینه هم‌زمان توسط دو متخصص برای بررسی دقیق و همه‌جانبه بدون عجله.',
          wide: true,
        },
        {
          id: 'atrium',
          category: 'canine',
          imageKey: 'hero',
          title: 'آتریوم گیاهی و فضای پذیرش مرکزی',
          meta: 'پذیرش · تصفیه هوای بیمارستانی',
          description: 'نمای مستقیم فضای سبز از لحظه ورود، حس امنیت و آرامش را به همراه شما منتقل می‌کند.',
          wide: true,
        },
      ],
    },
    booking: {
      kicker: 'نوبت‌دهی اختصاصی',
      title: 'رزرو ویزیت آرام و بدون معطلی',
      subtitle:
        'برای هر ویزیت اولیه، ۴۵ دقیقه زمان کامل در بخش اختصاصی متناسب با گونه همراه شما رزرو می‌شود.',
      highlights: [
        {
          title: 'ورود مستقیم و مجزا',
          text: 'امکان ورود از درب خصوصی برای سگ‌های حساس یا گربه‌های مضطرب بنا به درخواست شما.',
        },
        {
          title: 'بررسی پرونده پیش از ویزیت',
          text: 'تیم پزشکی آزمایش‌ها و مدارک قبلی را پیش از حضور شما مطالعه و تحلیل می‌کند.',
        },
        {
          title: 'مشاوره دوزبانه (فارسی و انگلیسی)',
          text: 'تیم متخصص ما به هر دو زبان فارسی و انگلیسی پاسخگوی کامل شماست.',
        },
      ],
      form: {
        speciesLabel: 'گونه حیوان خانگی',
        species: {
          dog: 'سگ',
          cat: 'گربه',
          exotic: 'پستاندار کوچک / پرنده',
        },
        petNameLabel: 'نام حیوان خانگی',
        petNamePlaceholder: 'مثلاً میلو، لونا',
        serviceLabel: 'خدمت تخصصی مورد نیاز',
        services: [
          'چکاپ کامل سلامت و طول عمر',
          'تصویربرداری تشخیصی (سونوگرافی / ام‌آرآی / سی‌تی‌اسکن)',
          'طب داخلی و مراقبت کلیوی گربه‌ها',
          'دندانپزشکی و جراحی میکروسکوپی',
          'قلب‌وعروق و اکوکاردیوگرافی',
        ],
        dateLabel: 'تاریخ پیشنهادی',
        timeLabel: 'بازه زمانی',
        timeSlots: ['۰۹:۳۰', '۱۱:۱۵', '۱۴:۰۰', '۱۶:۳۰', '۱۸:۴۵'],
        ownerNameLabel: 'نام و نام خانوادگی شما',
        ownerNamePlaceholder: 'نام کامل',
        contactLabel: 'ایمیل یا شماره تماس',
        contactPlaceholder: '۰۹۱۲... یا نشانی ایمیل',
        notesLabel: 'توضیحات بالینی (اختیاری)',
        notesPlaceholder: 'علائم فعلی، سوابق درمانی یا حساسیت‌های رفتاری را بنویسید...',
        submitBtn: 'ثبت درخواست نوبت',
        errorRequired: 'لطفاً نام حیوان خانگی، نام خود و تاریخ پیشنهادی را وارد کنید.',
        errorContact: 'لطفاً یک شماره تماس یا نشانی ایمیل معتبر وارد کنید.',
        successTitle: 'درخواست نوبت با موفقیت ثبت شد',
        successBody:
          'هماهنگ‌کننده بخش پذیرش طی ۳۰ دقیقه آینده جزئیات ورود اختصاصی شما را تأیید خواهد کرد.',
        refLabel: 'کد پیگیری نوبت',
        newRequestBtn: 'ثبت نوبت جدید',
      },
    },
    feedback: {
      kicker: 'نظرسنجی تجربه کاربری',
      title: 'آیا از تجربه گشت‌وگذار در سایت الارا رضایت دارید؟',
      subtitle: 'امتیاز ستاره‌ای شما کمک می‌کند خدمات دیجیتال و نوبت‌دهی کلینیک را پیوسته بهتر کنیم.',
      ratingLabels: [
        'نیاز به بهبود دارد',
        'متوسط',
        'خوب و کاربردی',
        'بسیار عالی',
        'فوق‌العاده و بی‌نقص',
      ],
      commentLabel: 'دیدگاه شما (اختیاری)',
      commentPlaceholder: 'اگر پیشنهادی دارید، با ما در میان بگذارید...',
      submitBtn: 'ثبت امتیاز',
      laterBtn: 'فعلاً نه',
      closeAria: 'بستن پنجره نظرسنجی',
      selectStarError: 'لطفاً ابتدا بین ۱ تا ۵ ستاره انتخاب کنید.',
      thanksTitle: 'با سپاس از مهر و همراهی شما',
      thanksBody: 'امتیاز شما ثبت شد و در ارتقای تجربه کلینیک الارا همراه ماست.',
    },
    footer: {
      tagline: 'ترکیب دقت معماری مدرن و مهربانی دامپزشکی تخصصی.',
      hoursTitle: 'ساعات پذیرش',
      hoursDetail: 'شنبه تا پنج‌شنبه · ۰۸:۰۰ تا ۲۱:۰۰',
      emergencyDetail: 'اورژانس و مراقبت ویژه ۲۴ ساعته',
      locationsTitle: 'شعب تخصصی',
      locationsDetail: 'تهران (جردن) · مونیخ (ماکسیمیلیان‌اشتراسه)',
      languageTitle: 'زبان نمایش',
      copyright: '© ۲۰۲۶ کلینیک تخصصی دامپزشکی الارا. تمامی حقوق محفوظ است.',
    },
  },

  en: {
    langLabel: 'English',
    dir: 'ltr',
    brand: 'Elara Vet',
    nav: {
      sanctuary: '3D Gallery',
      explorer3d: '3D Suite',
      specialties: 'Specialties',
      gallery: 'Spaces',
      book: 'Book Visit',
    },
    hero: {
      kicker: 'Specialized Companion Medicine · Munich & Tehran',
      title: 'Calm clinical precision for every companion.',
      motto: '“Every quiet breath of our companions is a trust held in science and kindness.”',
      subtitle:
        'Experience our bright sunlit veterinary sanctuary in interactive 3D. Auto-advancing spatial gallery, board-certified diagnostics, and joyful separated canine and feline wings.',
      primaryCta: 'Schedule Consultation',
      secondaryCta: 'Explore 3D Exam Suite',
      autoPlayOn: 'Auto-slide active',
      autoPlayOff: 'Slider paused',
      prevSlide: 'Previous photo',
      nextSlide: 'Next photo',
      slideHint: 'Move pointer for 3D depth · Auto-advances every 4s · Click side frames to focus',
      slides: [
        {
          id: 'atrium',
          imageKey: 'hero',
          title: 'Sunlit Travertine Atrium & Reception',
          subtitle: 'Acoustic limestone and indoor courtyard foliage calm anxious companions on arrival.',
          tag: '01 · Clinic Architecture',
        },
        {
          id: 'diagnostics',
          imageKey: 'diagnostics',
          title: 'High-Field MRI & Doppler Ultrasound Suite',
          subtitle: 'Quiet brushed-titanium imaging calibrated for gentle, low-stress positioning.',
          tag: '02 · Precision Diagnostics',
        },
        {
          id: 'surgery',
          imageKey: 'surgery',
          title: 'Micro-Surgery & Optical Dental Suite',
          subtitle: 'Positive-pressure sterile theatre with a dedicated veterinary anesthesiologist.',
          tag: '03 · Micro-Surgery',
        },
        {
          id: 'canine',
          imageKey: 'dog',
          title: 'Sunlit Canine Consultation Lounge',
          subtitle: 'Warm natural stone benches replace cold stainless cages for calm waiting.',
          tag: '04 · Canine Sanctuary',
        },
        {
          id: 'feline',
          imageKey: 'cat',
          title: 'Feline-Only Sound-Isolated Suite',
          subtitle: 'Woven linen cushions and pheromone diffusion with zero barking acoustics.',
          tag: '05 · Feline Sanctuary',
        },
        {
          id: 'specialists',
          imageKey: 'team',
          title: 'Collaborative Specialist Rounds',
          subtitle: 'Unhurried 45-minute consultations led jointly by board-certified clinicians.',
          tag: '06 · Specialist Team',
        },
      ],
    },
    explorer: {
      kicker: 'Interactive 3D Veterinary Suite',
      title: 'Inspect our clinical sanctuary in real-time 3D.',
      subtitle:
        'Orbit the heated travertine exam deck, inspect live ECG telemetry, separate architectural layers, and switch between daylight and evening ward moods.',
      dragHint: 'Drag to orbit 3D suite · Scroll to zoom · Click instruments to inspect',
      fallbackTitle: 'Elara Vet Sanctuary',
    },
    dock: {
      hideControls: 'Hide 3D Controls',
      showControls: 'Show 3D Controls',
      viewsLabel: 'Camera',
      views: {
        overview: 'Atrium',
        companions: 'Patients',
        diagnostics: 'Telemetry',
        lamp: 'Surgical Lamp',
      },
      explodeLabel: 'Layer Explode',
      moodLabel: 'Atmosphere',
      moods: {
        daylight: 'Daylight',
        evening: 'Evening Ward',
      },
      hotspots: {
        companions: {
          title: 'Fear-Free Companion Lounge',
          detail: 'Woven linen acoustic cushions keep canine and feline heart rates 32% calmer prior to exams.',
        },
        monitor: {
          title: 'Multi-Parameter Vital Telemetry',
          detail: 'Continuous ECG sinus rhythm, SpO2, and non-invasive Doppler blood pressure monitoring.',
        },
        table: {
          title: 'Heated Travertine Exam Deck',
          detail: 'Hydraulic vibration-free elevation with warm ceramic surface calibrated to 38.2°C.',
        },
        lamp: {
          title: 'Articulated Shadowless Optical Lamp',
          detail: 'Warm-balanced surgical illumination designed to avoid retinal glare for sensitive eyes.',
        },
      },
      inspectHint: 'Click any 3D station in the scene to inspect clinical details.',
    },
    philosophy: {
      kicker: 'Architectural Healing Environment',
      title: 'Veterinary medicine without clinical anxiety.',
      body: 'Every material inside Elara Vet Sanctuary—from sunlit travertine walls and natural botanical light to species-isolated examination wings—is engineered to bring calm joy and lower cortisol before a stethoscope ever touches your companion.',
      quote: '“A tranquil heart is already half the healing.”',
      imageCaption: 'Main sunlit atrium · Acoustic travertine & separated canine/feline reception wings',
      metrics: [
        { value: '24/7', label: 'Specialist Critical Care' },
        { value: '< 12 min', label: 'In-House Lab Turnaround' },
        { value: '42 dB', label: 'Acoustic Quiet Rating' },
        { value: '3', label: 'Dedicated Imaging Suites' },
      ],
    },
    specialties: {
      kicker: 'Clinical Disciplines',
      title: 'Precision diagnostics and gentle surgical craft.',
      subtitle:
        'Each discipline pairs hospital-grade medical technology with unhurried, specialist-led appointments.',
      items: [
        {
          num: '01.',
          title: 'Diagnostic Imaging & Doppler Ultrasound',
          description:
            'High-field veterinary MRI, low-dose 64-slice CT, and cardiac color-Doppler echocardiography with zero-restraint gentle positioning.',
          detail: 'Same-day radiologist report · Digital imaging archive',
          imageKey: 'diagnostics',
        },
        {
          num: '02.',
          title: 'Minimally Invasive Micro-Surgery & Dentistry',
          description:
            'Laparoscopic soft-tissue procedures, optical dental radiography, and microscope-assisted surgery in positive-pressure sterile suites.',
          detail: 'Dedicated veterinary anesthesiologist per case',
          imageKey: 'surgery',
        },
        {
          num: '03.',
          title: 'Feline-Only Internal & Renal Medicine',
          description:
            'Pheromone-diffused consultation rooms exclusively for cats—no barking acoustics, warm linen tables, and specialized geriatric renal care.',
          detail: 'Gold-Standard Cat Friendly Practice',
        },
        {
          num: '04.',
          title: 'Cardiology, Orthopedics & Longevity',
          description:
            'Preventive echocardiograms, mobility rehabilitation, and personalized nutrition protocols tailored to senior dogs and cats.',
          detail: 'Bi-annual longevity biomarker panel',
        },
      ],
    },
    gallery: {
      kicker: 'Inside the Sanctuary',
      title: 'Dignified care, captured in quiet daylight.',
      subtitle:
        'Filter our clinical spaces and patient sanctuaries to see how calm architecture supports faster recovery.',
      filters: {
        all: 'All Spaces',
        canine: 'Canine Care',
        feline: 'Feline Sanctuary',
        team: 'Specialists',
      },
      cards: [
        {
          id: 'dog-lounge',
          category: 'canine',
          imageKey: 'dog',
          title: 'Sunlit Canine Consultation Lounge',
          meta: 'Canine Wing · Ground Level',
          description: 'Warm stone benches and natural daylight replace cold stainless waiting cages.',
        },
        {
          id: 'cat-room',
          category: 'feline',
          imageKey: 'cat',
          title: 'Feline-Only Quiet Suite',
          meta: 'Feline Wing · Sound-Isolated',
          description: 'Soft linen cushions and window perches calibrated for relaxed feline examinations.',
        },
        {
          id: 'team-care',
          category: 'team',
          imageKey: 'team',
          title: 'Collaborative Specialist Rounds',
          meta: 'Internal Medicine · Cardiology',
          description: 'Two-specialist consultations ensure thorough diagnostics without rushing your companion.',
          wide: true,
        },
        {
          id: 'atrium',
          category: 'canine',
          imageKey: 'hero',
          title: 'Botanical Courtyard Atrium',
          meta: 'Reception · Air-Purified',
          description: 'Direct courtyard greenery gives anxious dogs visual calm the moment they walk in.',
          wide: true,
        },
      ],
    },
    booking: {
      kicker: 'Private Appointments',
      title: 'Reserve a calm, unhurried consultation.',
      subtitle:
        'Every first appointment reserves a full 45 minutes in a private wing tailored to your pet’s species.',
      highlights: [
        {
          title: 'Separated Arrival Protocol',
          text: 'Direct entrance access for reactive dogs or nervous cats upon request.',
        },
        {
          title: 'Pre-Visit Medical Review',
          text: 'Our specialist team reviews prior bloodwork and imaging before you arrive.',
        },
        {
          title: 'Bilingual Care Team',
          text: 'Consultations available fluently in both English and Persian.',
        },
      ],
      form: {
        speciesLabel: 'Companion Species',
        species: {
          dog: 'Dog',
          cat: 'Cat',
          exotic: 'Small Mammal / Bird',
        },
        petNameLabel: 'Companion Name',
        petNamePlaceholder: 'e.g., Milo, Luna',
        serviceLabel: 'Clinical Specialty',
        services: [
          'Comprehensive Wellness & Longevity Check',
          'Diagnostic Imaging (Ultrasound / MRI / CT)',
          'Feline Internal & Renal Medicine',
          'Dental & Micro-Surgical Consultation',
          'Cardiology & Echocardiography',
        ],
        dateLabel: 'Preferred Date',
        timeLabel: 'Time Window',
        timeSlots: ['09:30', '11:15', '14:00', '16:30', '18:45'],
        ownerNameLabel: 'Your Full Name',
        ownerNamePlaceholder: 'Full name',
        contactLabel: 'Email or Phone',
        contactPlaceholder: 'name@example.com or +49 / +98 ...',
        notesLabel: 'Clinical Notes (Optional)',
        notesPlaceholder: 'Describe symptoms, prior records, or calming preferences...',
        submitBtn: 'Confirm Visit Request',
        errorRequired: 'Please enter your companion’s name, your name, and preferred date.',
        errorContact: 'Please provide a valid email address or phone number.',
        successTitle: 'Consultation Request Reserved',
        successBody:
          'Our triage coordinator will confirm your private wing arrival details within 30 minutes.',
        refLabel: 'Reference Code',
        newRequestBtn: 'Book Another Visit',
      },
    },
    feedback: {
      kicker: 'Visitor Experience',
      title: 'Are you enjoying the Elara Sanctuary experience?',
      subtitle: 'Your star rating helps our clinic team refine our digital booking and 3D preview.',
      ratingLabels: [
        'Needs improvement',
        'Fair',
        'Good & helpful',
        'Very good',
        'Exceptional',
      ],
      commentLabel: 'Optional note',
      commentPlaceholder: 'Share a thought or suggestion...',
      submitBtn: 'Submit Rating',
      laterBtn: 'Not now',
      closeAria: 'Close rating dialog',
      selectStarError: 'Please choose between 1 and 5 stars first.',
      thanksTitle: 'Thank you for your feedback',
      thanksBody: 'We appreciate you taking a moment to rate your visit with Elara Vet.',
    },
    footer: {
      tagline: 'Architectural warmth meets gentle veterinary medicine.',
      hoursTitle: 'Clinic Hours',
      hoursDetail: 'Mon – Sat · 08:00 – 21:00',
      emergencyDetail: '24/7 Critical & ICU Triage',
      locationsTitle: 'Sanctuary Suites',
      locationsDetail: 'Maximilianstraße Suite, Munich · Jordan Sanctuary, Tehran',
      languageTitle: 'Language',
      copyright: '© 2026 Elara Vet Sanctuary. All rights reserved.',
    },
  },
};
