// ─────────────────────────────────────────────────────────────────────────────
// Translations for 10 languages
// ─────────────────────────────────────────────────────────────────────────────

export type LangCode = 'EN' | 'PT' | 'ES' | 'ZH' | 'AR' | 'FR' | 'DE' | 'RU' | 'JA' | 'KO'

const T: Record<string, Record<LangCode, string>> = {
  // ── Navigation ───────────────────────────────────────────────────────────
  nav_task:    { EN: 'Task',    PT: 'Tarefa',   ES: 'Tarea',    ZH: '任务',   AR: 'مهمة',      FR: 'Tâche',    DE: 'Aufgabe',   RU: 'Задача',    JA: 'タスク',          KO: '작업'    },
  nav_power:   { EN: 'Power',   PT: 'Poder',    ES: 'Potencia', ZH: '算力',   AR: 'قوة',       FR: 'Puissance',DE: 'Power',     RU: 'Мощность',  JA: 'パワー',          KO: '파워'    },
  nav_home:    { EN: 'Home',    PT: 'Início',   ES: 'Inicio',   ZH: '首页',   AR: 'الرئيسية',  FR: 'Accueil',  DE: 'Start',     RU: 'Главная',   JA: 'ホーム',          KO: '홈'      },
  nav_ai:      { EN: 'AI',      PT: 'IA',       ES: 'IA',       ZH: '智能',   AR: 'الذكاء',    FR: 'IA',       DE: 'KI',        RU: 'ИИ',        JA: 'AI',              KO: 'AI'      },
  nav_profile: { EN: 'Profile', PT: 'Perfil',   ES: 'Perfil',   ZH: '我的',   AR: 'الملف',     FR: 'Profil',   DE: 'Profil',    RU: 'Профиль',   JA: 'プロフィール',    KO: '프로필'  },

  // ── Common actions ────────────────────────────────────────────────────────
  deposit:     { EN: 'Deposit',  PT: 'Depositar', ES: 'Depositar', ZH: '充值',  AR: 'إيداع',  FR: 'Dépôt',      DE: 'Einzahlen',    RU: 'Депозит',   JA: '入金',    KO: '입금'  },
  withdraw:    { EN: 'Withdraw', PT: 'Sacar',     ES: 'Retirar',   ZH: '提现',  AR: 'سحب',    FR: 'Retirer',    DE: 'Abheben',      RU: 'Вывод',     JA: '出金',    KO: '출금'  },
  orders:      { EN: 'Orders',   PT: 'Pedidos',   ES: 'Pedidos',   ZH: '订单',  AR: 'الطلبات',FR: 'Commandes',  DE: 'Aufträge',     RU: 'Заказы',    JA: '注文',    KO: '주문'  },
  confirm:     { EN: 'Confirm',  PT: 'Confirmar', ES: 'Confirmar', ZH: '确认',  AR: 'تأكيد',  FR: 'Confirmer',  DE: 'Bestätigen',   RU: 'Принять',   JA: '確認',    KO: '확인'  },
  cancel:      { EN: 'Cancel',   PT: 'Cancelar',  ES: 'Cancelar',  ZH: '取消',  AR: 'إلغاء',  FR: 'Annuler',    DE: 'Abbrechen',    RU: 'Отмена',    JA: 'キャンセル', KO: '취소'  },
  save:        { EN: 'Save',     PT: 'Salvar',    ES: 'Guardar',   ZH: '保存',  AR: 'حفظ',    FR: 'Sauvegarder',DE: 'Speichern',    RU: 'Сохранить', JA: '保存',    KO: '저장'  },
  loading:     { EN: 'Loading…', PT: 'Carregando…',ES:'Cargando…', ZH: '加载中…',AR:'جار التحميل…',FR:'Chargement…',DE:'Laden…',   RU: 'Загрузка…', JA: '読込中…', KO: '로딩 중…' },
  back:        { EN: 'Back',     PT: 'Voltar',    ES: 'Volver',    ZH: '返回',  AR: 'رجوع',   FR: 'Retour',     DE: 'Zurück',       RU: 'Назад',     JA: '戻る',    KO: '뒤로'  },
  settings:    { EN: 'Settings', PT: 'Ajustes',   ES: 'Ajustes',   ZH: '设置',  AR: 'الإعدادات',FR:'Paramètres', DE: 'Einstellungen',RU: 'Настройки', JA: '設定',    KO: '설정'  },
  copy:        { EN: 'Copy',     PT: 'Copiar',    ES: 'Copiar',    ZH: '复制',  AR: 'نسخ',    FR: 'Copier',     DE: 'Kopieren',     RU: 'Копировать',JA: 'コピー',  KO: '복사'  },
  copied:      { EN: 'Copied!',  PT: 'Copiado!',  ES: '¡Copiado!', ZH: '已复制!',AR:'تم النسخ!',FR:'Copié !',   DE: 'Kopiert!',     RU: 'Скопировано!',JA:'コピー済み!',KO:'복사됨!'  },

  // ── Balance ───────────────────────────────────────────────────────────────
  balance:        { EN: 'Balance',    PT: 'Saldo',          ES: 'Saldo',       ZH: '余额',    AR: 'الرصيد',    FR: 'Solde',      DE: 'Guthaben',        RU: 'Баланс',     JA: '残高',    KO: '잔액'   },
  task_balance:   { EN: 'Task Balance',   PT: 'Saldo de Tarefas', ES: 'Saldo de Tareas', ZH: '任务余额', AR: 'رصيد المهام',FR:'Solde Tâche',   DE:'Task-Guthaben',    RU:'Баланс задач',JA:'タスク残高',KO:'작업 잔액'  },
  vault_balance:  { EN: 'Vault Balance',  PT: 'Saldo do Cofre',   ES: 'Saldo del Cofre', ZH: '钱包余额', AR: 'رصيد الخزنة',FR:'Solde Coffre',  DE:'Tresor-Guthaben',  RU:'Хранилище',  JA:'金庫残高', KO:'금고 잔액' },
  withdrawal_bal: { EN: 'Withdrawal',    PT: 'Saques',    ES: 'Retiro',    ZH: '可提现',  AR: 'السحب',  FR: 'Retrait',    DE: 'Auszahlung',    RU: 'Вывод',      JA: '出金可能',KO: '출금'    },

  // ── Task page ─────────────────────────────────────────────────────────────
  task_center:  { EN: 'Task Center',  PT: 'Central de Tarefas', ES: 'Centro de Tareas', ZH: '任务中心', AR: 'مركز المهام', FR: 'Centre des Tâches', DE: 'Aufgabenzentrum', RU: 'Центр задач',    JA: 'タスクセンター', KO: '작업 센터'  },
  my_orders:    { EN: 'My Orders',    PT: 'Meus Pedidos',       ES: 'Mis Pedidos',       ZH: '我的订单', AR: 'طلباتي',      FR: 'Mes Commandes',     DE: 'Meine Aufträge',  RU: 'Мои заказы',     JA: '注文履歴',       KO: '내 주문'    },
  open_now:     { EN: 'Open Now',     PT: 'Abrir Agora',        ES: 'Abrir Ahora',       ZH: '立即开启', AR: 'افتح الآن',   FR: 'Ouvrir',            DE: 'Öffnen',          RU: 'Открыть',        JA: '今すぐ開く',     KO: '지금 열기'  },
  deposit_now:  { EN: 'Deposit Now',  PT: 'Depositar Agora',    ES: 'Depositar Ahora',   ZH: '立即充值', AR: 'أودع الآن',   FR: 'Déposer',           DE: 'Jetzt Einzahlen', RU: 'Пополнить',      JA: '今すぐ入金',     KO: '지금 입금'  },
  buy_now:      { EN: 'Buy Now',      PT: 'Comprar Agora',      ES: 'Comprar Ahora',     ZH: '立即购买', AR: 'اشتر الآن',   FR: 'Acheter',           DE: 'Kaufen',          RU: 'Купить',         JA: '今すぐ購入',     KO: '지금 구매'  },

  // ── Order status ──────────────────────────────────────────────────────────
  status_pending:   { EN: 'Pending',    PT: 'Pendente',  ES: 'Pendiente',  ZH: '待处理', AR: 'قيد الانتظار',FR: 'En attente', DE: 'Ausstehend',       RU: 'Ожидание',   JA: '保留中',  KO: '대기 중' },
  status_active:    { EN: 'Active',     PT: 'Ativo',     ES: 'Activo',     ZH: '进行中', AR: 'نشط',         FR: 'Actif',      DE: 'Aktiv',            RU: 'Активный',   JA: 'アクティブ', KO: '활성'   },
  status_completed: { EN: 'Completed',  PT: 'Concluído', ES: 'Completado', ZH: '已完成', AR: 'مكتمل',       FR: 'Terminé',    DE: 'Abgeschlossen',    RU: 'Завершено',  JA: '完了',    KO: '완료'   },
  status_failed:    { EN: 'Failed',     PT: 'Falhou',    ES: 'Fallido',    ZH: '失败',   AR: 'فشل',         FR: 'Échoué',     DE: 'Fehlgeschlagen',   RU: 'Ошибка',     JA: '失敗',    KO: '실패'   },

  // ── Profile ───────────────────────────────────────────────────────────────
  my_profile:   { EN: 'My Profile',  PT: 'Meu Perfil', ES: 'Mi Perfil',  ZH: '我的资料', AR: 'ملفي', FR: 'Mon Profil',  DE: 'Mein Profil',  RU: 'Мой профиль', JA: 'プロフィール', KO: '내 프로필'  },
  language:     { EN: 'Language',    PT: 'Idioma',     ES: 'Idioma',     ZH: '语言',     AR: 'اللغة',FR: 'Langue',      DE: 'Sprache',      RU: 'Язык',        JA: '言語',        KO: '언어'       },
  logout:       { EN: 'Log Out',     PT: 'Sair',       ES: 'Cerrar Sesión',ZH: '退出',   AR: 'خروج', FR: 'Déconnexion', DE: 'Abmelden',     RU: 'Выйти',       JA: 'ログアウト',  KO: '로그아웃'   },
  team:         { EN: 'Team',        PT: 'Equipe',     ES: 'Equipo',     ZH: '团队',     AR: 'الفريق',FR: 'Équipe',     DE: 'Team',         RU: 'Команда',     JA: 'チーム',      KO: '팀'         },
  share:        { EN: 'Share',       PT: 'Compartilhar',ES: 'Compartir', ZH: '分享',     AR: 'مشاركة',FR: 'Partager',   DE: 'Teilen',       RU: 'Поделиться',  JA: 'シェア',      KO: '공유'       },
  kyc:          { EN: 'KYC',         PT: 'KYC',        ES: 'KYC',        ZH: 'KYC认证',  AR: 'KYC',  FR: 'KYC',         DE: 'KYC',          RU: 'KYC',         JA: 'KYC認証',     KO: 'KYC'        },
  device:       { EN: 'Device',      PT: 'Dispositivo',ES: 'Dispositivo',ZH: '设备',     AR: 'الجهاز',FR: 'Appareil',   DE: 'Gerät',        RU: 'Устройство',  JA: 'デバイス',    KO: '기기'       },
  about_us:     { EN: 'About Us',    PT: 'Sobre Nós',  ES: 'Sobre Nosotros',ZH: '关于我们',AR: 'عنا', FR: 'À propos',    DE: 'Über uns',     RU: 'О нас',       JA: '私たちについて',KO: '회사소개'  },

  // ── Power ─────────────────────────────────────────────────────────────────
  my_power:   { EN: 'My Power',       PT: 'Meu Poder',    ES: 'Mi Potencia',  ZH: '我的算力', AR: 'قوتي',     FR: 'Ma Puissance',  DE: 'Meine Power',  RU: 'Моя мощность',JA: 'マイパワー',   KO: '내 파워'   },
  no_tasks:   { EN: 'No tasks yet',   PT: 'Sem tarefas',  ES: 'Sin tareas',   ZH: '暂无任务', AR: 'لا مهام',  FR: 'Aucune tâche',  DE: 'Keine Aufgaben',RU: 'Нет задач',   JA: 'タスクなし',  KO: '작업 없음' },
  invested:   { EN: 'Invested',       PT: 'Investido',    ES: 'Invertido',    ZH: '已投资',   AR: 'مستثمر',   FR: 'Investi',       DE: 'Investiert',   RU: 'Вложено',     JA: '投資済み',    KO: '투자됨'    },
  profit:     { EN: 'Profit',         PT: 'Lucro',        ES: 'Ganancia',     ZH: '收益',     AR: 'الربح',    FR: 'Profit',        DE: 'Gewinn',        RU: 'Доход',       JA: '利益',        KO: '수익'      },
  rate:       { EN: 'Rate',           PT: 'Taxa',         ES: 'Tasa',         ZH: '收益率',   AR: 'المعدل',   FR: 'Taux',          DE: 'Rate',          RU: 'Ставка',      JA: '利率',        KO: '금리'      },
  expected:   { EN: 'Expected',       PT: 'Esperado',     ES: 'Esperado',     ZH: '预期',     AR: 'متوقع',    FR: 'Prévu',         DE: 'Erwartet',      RU: 'Ожидается',   JA: '見込み',      KO: '예상'      },
  total_received:{ EN: 'Total received', PT: 'Total recebido', ES: 'Total recibido', ZH: '总收到',AR:'المجموع',  FR: 'Total reçu',   DE: 'Gesamt erhalten',RU:'Всего получено',JA:'受取合計',   KO: '총 수령액'  },

  // ── Home ──────────────────────────────────────────────────────────────────
  total_earnings: { EN: 'Total Earnings',  PT: 'Ganhos Totais',  ES: 'Ganancias Totales', ZH: '总收益', AR: 'إجمالي الأرباح', FR: 'Gains Totaux', DE: 'Gesamtgewinn',  RU: 'Всего доход',  JA: '総収益',    KO: '총 수익'  },
  daily_yield:    { EN: 'Daily Yield',     PT: 'Rendimento Diário', ES: 'Rendimiento Diario',ZH: '日收益',AR: 'العائد اليومي',   FR: 'Revenu Quotidien',DE: 'Tagesertrag', RU: 'Суточный доход',JA: '日次収益',KO: '일일 수익' },
  notifications:  { EN: 'Notifications',  PT: 'Notificações',  ES: 'Notificaciones',  ZH: '通知',   AR: 'الإشعارات',      FR: 'Notifications', DE: 'Benachrichtigungen',RU:'Уведомления',JA:'通知',       KO: '알림'      },
}

/** Returns translated string for key in given lang, falling back to EN */
export function t(key: string, lang: LangCode | string): string {
  const row = T[key]
  if (!row) return key
  return row[(lang as LangCode)] ?? row['EN'] ?? key
}

export default T
