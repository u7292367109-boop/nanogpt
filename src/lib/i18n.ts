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
  claim:       { EN: 'Claim',    PT: 'Resgatar',  ES: 'Reclamar',  ZH: '领取',  AR: 'استلام', FR: 'Réclamer',   DE: 'Abholen',      RU: 'Получить',  JA: '受け取る',KO: '수령'  },
  claiming:    { EN: 'Claiming…',PT: 'Resgatando…',ES:'Reclamando…',ZH:'领取中…',AR:'جار الاستلام…',FR:'Réclamation…',DE:'Abholen…',RU:'Получение…',JA:'受け取り中…',KO:'수령 중…'},
  processing:  { EN: 'Processing…',PT:'Processando…',ES:'Procesando…',ZH:'处理中…',AR:'جار المعالجة…',FR:'Traitement…',DE:'Verarbeitung…',RU:'Обработка…',JA:'処理中…',KO:'처리 중…'},

  // ── Balance ───────────────────────────────────────────────────────────────
  balance:            { EN: 'Balance',          PT: 'Saldo',              ES: 'Saldo',               ZH: '余额',    AR: 'الرصيد',         FR: 'Solde',            DE: 'Guthaben',           RU: 'Баланс',          JA: '残高',        KO: '잔액'      },
  task_balance:       { EN: 'Task Balance',     PT: 'Saldo de Tarefas',   ES: 'Saldo de Tareas',     ZH: '任务余额', AR: 'رصيد المهام',   FR: 'Solde Tâche',      DE: 'Task-Guthaben',      RU: 'Баланс задач',    JA: 'タスク残高',  KO: '작업 잔액'  },
  vault_balance:      { EN: 'Vault Balance',    PT: 'Saldo do Cofre',     ES: 'Saldo del Cofre',     ZH: '钱包余额', AR: 'رصيد الخزنة',   FR: 'Solde Coffre',     DE: 'Tresor-Guthaben',    RU: 'Хранилище',       JA: '金庫残高',    KO: '금고 잔액'  },
  withdrawal_bal:     { EN: 'Withdrawal',       PT: 'Saques',             ES: 'Retiro',              ZH: '可提现',  AR: 'السحب',          FR: 'Retrait',          DE: 'Auszahlung',         RU: 'Вывод',           JA: '出金可能',    KO: '출금'       },
  available_balance:  { EN: 'Available Balance',PT: 'Saldo Disponível',   ES: 'Saldo Disponible',    ZH: '可用余额', AR: 'الرصيد المتاح', FR: 'Solde disponible', DE: 'Verfügbares Guthaben',RU: 'Доступный баланс',JA: '利用可能残高', KO: '사용 가능 잔액'},
  available_balance_hint:{ EN:'From completed tasks + daily yield', PT:'De tarefas concluídas + rendimento diário', ES:'De tareas completadas + rendimiento diario', ZH:'来自已完成任务+日收益', AR:'من المهام المكتملة + العائد اليومي', FR:'Tâches terminées + revenu quotidien', DE:'Aus erledigten Aufgaben + Tagesertrag', RU:'Из выполненных задач + дневной доход', JA:'完了タスク + 日次収益から', KO:'완료된 작업 + 일일 수익에서'},
  total_assets:       { EN: 'My total assets',  PT: 'Meus ativos totais', ES: 'Mis activos totales', ZH: '我的总资产',AR: 'إجمالي أصولي',  FR: 'Total de mes actifs',DE: 'Mein Gesamtvermögen',RU: 'Все мои активы',   JA: '総資産',      KO: '총 자산'    },
  asset_center:       { EN: 'Asset Center',     PT: 'Centro de Ativos',   ES: 'Centro de Activos',   ZH: '资产中心', AR: 'مركز الأصول',   FR: "Centre d'actifs",  DE: 'Asset-Center',       RU: 'Центр активов',   JA: '資産センター',KO: '자산 센터'  },
  active_orders:      { EN: 'Active orders',    PT: 'Pedidos ativos',     ES: 'Pedidos activos',     ZH: '活跃订单', AR: 'الطلبات النشطة', FR: 'Commandes actives',DE: 'Aktive Aufträge',    RU: 'Активные заказы', JA: 'アクティブな注文',KO: '활성 주문' },
  buy_packages:       { EN: 'Buy task packages',PT: 'Comprar pacotes',    ES: 'Comprar paquetes',    ZH: '购买任务套餐',AR:'شراء باقات المهام',FR:'Acheter des packages',DE:'Pakete kaufen',    RU: 'Купить пакеты',   JA: 'パッケージ購入',KO: '패키지 구매'},
  withdraw_earnings:  { EN: 'Withdraw earnings',PT: 'Sacar ganhos',       ES: 'Retirar ganancias',   ZH: '提取收益', AR: 'سحب الأرباح',   FR: 'Retirer les gains',DE: 'Gewinne abheben',    RU: 'Вывести доход',   JA: '利益を出金',  KO: '수익 출금'  },

  // ── Task page ─────────────────────────────────────────────────────────────
  task_center:     { EN: 'Task Center',   PT: 'Central de Tarefas',  ES: 'Centro de Tareas',  ZH: '任务中心', AR: 'مركز المهام',  FR: 'Centre des Tâches',  DE: 'Aufgabenzentrum', RU: 'Центр задач',    JA: 'タスクセンター', KO: '작업 센터'  },
  my_orders:       { EN: 'My Orders',     PT: 'Meus Pedidos',        ES: 'Mis Pedidos',        ZH: '我的订单', AR: 'طلباتي',       FR: 'Mes Commandes',      DE: 'Meine Aufträge',  RU: 'Мои заказы',     JA: '注文履歴',       KO: '내 주문'    },
  open_now:        { EN: 'Open Now',      PT: 'Abrir Agora',         ES: 'Abrir Ahora',        ZH: '立即开启', AR: 'افتح الآن',    FR: 'Ouvrir',             DE: 'Öffnen',          RU: 'Открыть',        JA: '今すぐ開く',     KO: '지금 열기'  },
  deposit_now:     { EN: 'Deposit Now',   PT: 'Depositar Agora',     ES: 'Depositar Ahora',    ZH: '立即充值', AR: 'أودع الآن',    FR: 'Déposer',            DE: 'Jetzt Einzahlen', RU: 'Пополнить',      JA: '今すぐ入金',     KO: '지금 입금'  },
  buy_now:         { EN: 'Buy Now',       PT: 'Comprar Agora',       ES: 'Comprar Ahora',      ZH: '立即购买', AR: 'اشتر الآن',    FR: 'Acheter',            DE: 'Kaufen',          RU: 'Купить',         JA: '今すぐ購入',     KO: '지금 구매'  },
  vault_balance_hint:{ EN:'Used to purchase task packages below', PT:'Usado para comprar pacotes abaixo', ES:'Usado para comprar paquetes', ZH:'用于购买下方任务套餐', AR:'لشراء باقات المهام أدناه', FR:'Pour acheter des packages', DE:'Zum Kauf von Task-Paketen', RU:'Для покупки пакетов задач', JA:'タスクパッケージ購入用', KO:'작업 패키지 구매용'},
  level_progress:  { EN: 'Level Progress',PT: 'Progresso de Nível',  ES: 'Progreso de Nivel',  ZH: '等级进度', AR: 'تقدم المستوى', FR: 'Progression de niveau',DE: 'Level-Fortschritt',RU: 'Прогресс уровня',JA: 'レベル進捗',     KO: '레벨 진행도'},
  max_level:       { EN: 'Max Level Reached', PT:'Nível Máximo Atingido', ES:'Nivel Máximo Alcanzado', ZH:'已达最高等级', AR:'تم الوصول للمستوى الأقصى', FR:'Niveau maximum atteint', DE:'Maximales Level erreicht', RU:'Максимальный уровень', JA:'最大レベル到達', KO:'최대 레벨 달성'},
  accelerator:     { EN: 'Accelerator',   PT: 'Acelerador',          ES: 'Acelerador',         ZH: '加速器',  AR: 'المسرّع',      FR: 'Accélérateur',       DE: 'Beschleuniger',   RU: 'Ускоритель',     JA: 'アクセラレータ', KO: '가속기'     },
  supercomputing:  { EN: 'SuperComputing',PT: 'Supercomputação',     ES: 'Supercomputación',   ZH: '超算',    AR: 'الحوسبة الفائقة',FR:'Supercalcul',        DE: 'Supercomputing',  RU: 'Суперкомпьютинг',JA: 'スーパーコンピューティング',KO:'슈퍼컴퓨팅'},
  task_type_label: { EN: 'Type of task:', PT: 'Tipo de tarefa:',     ES: 'Tipo de tarea:',     ZH: '任务类型:',AR: 'نوع المهمة:',  FR: 'Type de tâche:',    DE: 'Aufgabentyp:',    RU: 'Тип задачи:',    JA: 'タスクの種類:',  KO: '작업 유형:' },
  total_return:    { EN: 'Total return:',  PT: 'Retorno total:',      ES: 'Retorno total:',     ZH: '总回报:',  AR: 'العائد الكلي:', FR: 'Retour total:',      DE: 'Gesamtrendite:',  RU: 'Доходность:',    JA: '総利回り:',      KO: '총 수익률:' },
  from_label:      { EN: 'From:',         PT: 'A partir de:',        ES: 'Desde:',             ZH: '起始:',   AR: 'من:',           FR: 'À partir de:',       DE: 'Ab:',             RU: 'От:',            JA: 'から:',          KO: '시작:'      },

  // ── Order status ──────────────────────────────────────────────────────────
  status_pending:   { EN: 'Pending',   PT: 'Pendente',  ES: 'Pendiente',  ZH: '待处理', AR: 'قيد الانتظار',FR: 'En attente', DE: 'Ausstehend',    RU: 'Ожидание',   JA: '保留中',      KO: '대기 중' },
  status_active:    { EN: 'Active',    PT: 'Ativo',     ES: 'Activo',     ZH: '进行中', AR: 'نشط',         FR: 'Actif',      DE: 'Aktiv',         RU: 'Активный',   JA: 'アクティブ',  KO: '활성'   },
  status_completed: { EN: 'Completed', PT: 'Concluído', ES: 'Completado', ZH: '已完成', AR: 'مكتمل',       FR: 'Terminé',    DE: 'Abgeschlossen', RU: 'Завершено',  JA: '完了',        KO: '완료'   },
  status_failed:    { EN: 'Failed',    PT: 'Falhou',    ES: 'Fallido',    ZH: '失败',   AR: 'فشل',         FR: 'Échoué',     DE: 'Fehlgeschlagen',RU: 'Ошибка',     JA: '失敗',        KO: '실패'   },
  status_label:     { EN: 'Status',    PT: 'Status',    ES: 'Estado',     ZH: '状态',   AR: 'الحالة',      FR: 'Statut',     DE: 'Status',        RU: 'Статус',     JA: 'ステータス',  KO: '상태'   },

  // ── Orders page ───────────────────────────────────────────────────────────
  task_orders:    { EN: 'Task Orders',           PT: 'Pedidos de Tarefa',         ES: 'Pedidos de Tarea',          ZH: '任务订单', AR: 'طلبات المهام',       FR: 'Commandes de Tâches',   DE: 'Aufgabenaufträge',       RU: 'Заказы задач',      JA: 'タスク注文',        KO: '작업 주문'      },
  history:        { EN: 'History',               PT: 'Histórico',                 ES: 'Historial',                 ZH: '历史',    AR: 'السجل',              FR: 'Historique',             DE: 'Verlauf',               RU: 'История',           JA: '履歴',              KO: '내역'           },
  no_orders:      { EN: 'No task orders yet',    PT: 'Sem pedidos de tarefas',    ES: 'Sin pedidos de tareas',     ZH: '暂无任务订单',AR:'لا طلبات مهام بعد',FR: 'Aucune commande de tâche',DE: 'Keine Aufgabenaufträge', RU: 'Нет заказов задач', JA: 'タスク注文なし',    KO: '작업 주문 없음'  },
  no_orders_hint: { EN: 'Open a task in the Task Center to get started', PT:'Abra uma tarefa na Central de Tarefas para começar', ES:'Abre una tarea en el Centro de Tareas para comenzar', ZH:'在任务中心打开任务以开始', AR:'افتح مهمة في مركز المهام', FR:'Ouvrez une tâche dans le Centre des Tâches', DE:'Öffnen Sie eine Aufgabe im Aufgabenzentrum', RU:'Откройте задачу в Центре задач', JA:'タスクセンターでタスクを開いて始めましょう', KO:'작업 센터에서 작업을 열어 시작하세요'},
  no_transactions: { EN: 'No transactions yet', PT: 'Sem transações ainda',      ES: 'Sin transacciones aún',     ZH: '暂无交易', AR: 'لا معاملات بعد',     FR: 'Aucune transaction',     DE: 'Keine Transaktionen',    RU: 'Нет транзакций',    JA: '取引なし',          KO: '거래 없음'      },
  invested:        { EN: 'Invested',             PT: 'Investido',                 ES: 'Invertido',                 ZH: '已投资',  AR: 'مستثمر',             FR: 'Investi',                DE: 'Investiert',             RU: 'Вложено',           JA: '投資済み',          KO: '투자됨'         },
  profit:          { EN: 'Profit',               PT: 'Lucro',                     ES: 'Ganancia',                  ZH: '收益',    AR: 'الربح',              FR: 'Profit',                 DE: 'Gewinn',                 RU: 'Доход',             JA: '利益',              KO: '수익'           },
  rate:            { EN: 'Rate',                 PT: 'Taxa',                      ES: 'Tasa',                      ZH: '收益率',  AR: 'المعدل',             FR: 'Taux',                   DE: 'Rate',                   RU: 'Ставка',            JA: '利率',              KO: '금리'           },
  expected:        { EN: 'Expected',             PT: 'Esperado',                  ES: 'Esperado',                  ZH: '预期',    AR: 'متوقع',              FR: 'Prévu',                  DE: 'Erwartet',               RU: 'Ожидается',         JA: '見込み',            KO: '예상'           },
  total_received:  { EN: 'Total received',       PT: 'Total recebido',            ES: 'Total recibido',            ZH: '总收到',  AR: 'المجموع',            FR: 'Total reçu',             DE: 'Gesamt erhalten',        RU: 'Всего получено',    JA: '受取合計',          KO: '총 수령액'      },
  completing:      { EN: 'Completing…',          PT: 'Concluindo…',               ES: 'Completando…',              ZH: '完成中…', AR: 'جار الإكمال…',       FR: "En cours d'achèvement…", DE: 'Abschließen…',           RU: 'Завершение…',       JA: '完了中…',           KO: '완료 중…'       },
  completes:       { EN: 'Completes:',           PT: 'Conclui:',                  ES: 'Completa:',                 ZH: '完成:',   AR: 'ينتهي:',             FR: 'Se termine:',            DE: 'Abschluss:',             RU: 'Завершится:',       JA: '完了:',             KO: '완료:'          },
  days_left:       { EN: 'd left',               PT: 'd restantes',               ES: 'd restantes',               ZH: '天剩余',  AR: 'أيام متبقية',        FR: 'j restants',             DE: 'T verbleibend',          RU: 'дн. осталось',      JA: '日残り',            KO: '일 남음'        },

  // ── Profile ───────────────────────────────────────────────────────────────
  my_profile:      { EN: 'My Profile',      PT: 'Meu Perfil',           ES: 'Mi Perfil',            ZH: '我的资料', AR: 'ملفي',         FR: 'Mon Profil',        DE: 'Mein Profil',       RU: 'Мой профиль',      JA: 'プロフィール',   KO: '내 프로필'  },
  language:        { EN: 'Language',        PT: 'Idioma',               ES: 'Idioma',               ZH: '语言',     AR: 'اللغة',        FR: 'Langue',            DE: 'Sprache',           RU: 'Язык',             JA: '言語',           KO: '언어'       },
  logout:          { EN: 'Log Out',         PT: 'Sair',                 ES: 'Cerrar Sesión',        ZH: '退出',     AR: 'خروج',         FR: 'Déconnexion',       DE: 'Abmelden',          RU: 'Выйти',            JA: 'ログアウト',     KO: '로그아웃'   },
  team:            { EN: 'Team',            PT: 'Equipe',               ES: 'Equipo',               ZH: '团队',     AR: 'الفريق',       FR: 'Équipe',            DE: 'Team',              RU: 'Команда',          JA: 'チーム',         KO: '팀'         },
  share:           { EN: 'Share',           PT: 'Compartilhar',         ES: 'Compartir',            ZH: '分享',     AR: 'مشاركة',       FR: 'Partager',          DE: 'Teilen',            RU: 'Поделиться',       JA: 'シェア',         KO: '공유'       },
  kyc:             { EN: 'KYC',             PT: 'KYC',                  ES: 'KYC',                  ZH: 'KYC认证',  AR: 'KYC',          FR: 'KYC',               DE: 'KYC',               RU: 'KYC',              JA: 'KYC認証',        KO: 'KYC'        },
  device:          { EN: 'Device',          PT: 'Dispositivo',          ES: 'Dispositivo',          ZH: '设备',     AR: 'الجهاز',       FR: 'Appareil',          DE: 'Gerät',             RU: 'Устройство',       JA: 'デバイス',       KO: '기기'       },
  about_us:        { EN: 'About Us',        PT: 'Sobre Nós',            ES: 'Sobre Nosotros',       ZH: '关于我们', AR: 'عنا',          FR: 'À propos',          DE: 'Über uns',          RU: 'О нас',            JA: '私たちについて', KO: '회사소개'  },
  customer_service:{ EN: 'Customer Service',PT: 'Atendimento ao Cliente',ES:'Servicio al Cliente',  ZH: '客服',     AR: 'خدمة العملاء', FR: 'Service Client',    DE: 'Kundendienst',      RU: 'Служба поддержки', JA: 'カスタマーサービス',KO:'고객 서비스'},
  computing_pool:  { EN: 'Computing Pool',  PT: 'Pool de Computação',   ES: 'Grupo de Computación',ZH: '算力池',   AR: 'مجمع الحوسبة', FR: 'Pool de calcul',    DE: 'Computing-Pool',    RU: 'Вычислительный пул',JA:'コンピューティングプール',KO:'컴퓨팅 풀'},
  my_device:       { EN: 'My Device',       PT: 'Meu Dispositivo',      ES: 'Mi Dispositivo',       ZH: '我的设备', AR: 'جهازي',        FR: 'Mon Appareil',      DE: 'Mein Gerät',        RU: 'Моё устройство',   JA: 'マイデバイス',   KO: '내 기기'    },
  my_team:         { EN: 'My Team',         PT: 'Minha Equipe',         ES: 'Mi Equipo',            ZH: '我的团队', AR: 'فريقي',        FR: 'Mon Équipe',        DE: 'Mein Team',         RU: 'Моя команда',      JA: 'マイチーム',     KO: '내 팀'      },

  // ── Power ─────────────────────────────────────────────────────────────────
  my_power:        { EN: 'My Power',          PT: 'Meu Poder',            ES: 'Mi Potencia',          ZH: '我的算力', AR: 'قوتي',          FR: 'Ma Puissance',       DE: 'Meine Power',       RU: 'Моя мощность',     JA: 'マイパワー',      KO: '내 파워'    },
  no_tasks:        { EN: 'No tasks yet',      PT: 'Sem tarefas',          ES: 'Sin tareas',           ZH: '暂无任务', AR: 'لا مهام',       FR: 'Aucune tâche',       DE: 'Keine Aufgaben',    RU: 'Нет задач',        JA: 'タスクなし',      KO: '작업 없음'  },
  personal_device: { EN: 'Personal device',   PT: 'Dispositivo pessoal',  ES: 'Dispositivo personal', ZH: '个人设备', AR: 'الجهاز الشخصي', FR: 'Appareil personnel', DE: 'Persönliches Gerät',RU: 'Личное устройство',JA: '個人デバイス',    KO: '개인 기기'  },
  node_power:      { EN: 'Node power',        PT: 'Poder do nó',          ES: 'Potencia del nodo',    ZH: '节点算力', AR: 'قوة العقدة',    FR: 'Puissance du nœud',  DE: 'Node-Leistung',     RU: 'Мощность узла',    JA: 'ノードパワー',    KO: '노드 파워'  },
  model_label:     { EN: 'Model:',            PT: 'Modelo:',              ES: 'Modelo:',              ZH: '型号:',   AR: 'الطراز:',       FR: 'Modèle:',            DE: 'Modell:',           RU: 'Модель:',          JA: 'モデル:',         KO: '모델:'      },
  training_profit: { EN: 'Training Task Profit',PT:'Lucro de Treinamento', ES:'Ganancia de Entrenamiento',ZH:'训练收益',AR:'أرباح التدريب', FR:"Profit d'entraînement",DE:'Trainingsgewinn',   RU:'Доход от обучения', JA:'トレーニング利益',  KO:'훈련 수익'   },
  training_tasks:  { EN: 'Training tasks',    PT: 'Tarefas de treinamento',ES:'Tareas de entrenamiento',ZH:'训练任务',AR:'مهام التدريب',   FR:"Tâches d'entraînement",DE:'Trainingsaufgaben',  RU:'Задачи обучения',   JA:'トレーニングタスク',KO:'훈련 작업'   },
  more_profit:     { EN: 'More profit',       PT: 'Mais lucro',           ES: 'Más ganancias',        ZH: '更多收益', AR: 'مزيد من الأرباح',FR:'Plus de profits',    DE: 'Mehr Gewinn',       RU: 'Больше дохода',    JA: 'より多くの利益',  KO: '더 많은 수익'},
  no_data:         { EN: '– No data –',       PT: '– Sem dados –',        ES: '– Sin datos –',        ZH: '– 暂无数据 –',AR:'– لا بيانات –', FR:'– Pas de données –',DE: '– Keine Daten –',   RU: '– Нет данных –',   JA: '– データなし –',  KO: '– 데이터 없음 –'},
  go_now:          { EN: 'Go now',            PT: 'Ir agora',             ES: 'Ir ahora',             ZH: '立即前往', AR: 'اذهب الآن',     FR: 'Aller maintenant',   DE: 'Jetzt gehen',       RU: 'Перейти',          JA: '今すぐ',           KO: '지금 이동'  },
  completing_soon: { EN: 'Completing soon…',  PT: 'Concluindo em breve…', ES: 'Completando pronto…',  ZH: '即将完成…', AR:'على وشك الاكتمال…',FR:'Bientôt terminé…',  DE: 'Bald abgeschlossen…',RU:'Скоро завершится…', JA:'まもなく完了…',    KO:'곧 완료…'    },
  daily_yield_card:{ EN: 'Daily Yield',       PT: 'Rendimento Diário',    ES: 'Rendimiento Diario',   ZH: '日收益',  AR: 'العائد اليومي', FR: 'Revenu Quotidien',   DE: 'Tagesertrag',       RU: 'Суточный доход',   JA: '日次収益',        KO: '일일 수익'  },
  total_yield_card:{ EN: 'Total Yield',       PT: 'Rendimento Total',     ES: 'Rendimiento Total',    ZH: '总收益',  AR: 'العائد الكلي',  FR: 'Revenu Total',       DE: 'Gesamtertrag',      RU: 'Всего доход',      JA: '総収益',          KO: '총 수익'    },
  withdrawable:    { EN: 'Withdrawable',      PT: 'Disponível p/ Saque',  ES: 'Retirable',            ZH: '可提现',  AR: 'قابل للسحب',   FR: 'Retirable',          DE: 'Auszahlbar',        RU: 'Доступно для вывода',JA:'引出可能',        KO: '출금 가능'  },

  // ── Home ──────────────────────────────────────────────────────────────────
  welcome:          { EN: 'Welcome To UltraGPT',  PT: 'Bem-vindo ao UltraGPT',   ES: 'Bienvenido a UltraGPT',   ZH: '欢迎来到UltraGPT',AR:'مرحباً بك في UltraGPT', FR:'Bienvenue sur UltraGPT', DE:'Willkommen bei UltraGPT', RU:'Добро пожаловать в UltraGPT', JA:'UltraGPTへようこそ', KO:'UltraGPT에 오신 것을 환영합니다'},
  notice:           { EN: 'Notice',             PT: 'Aviso',                  ES: 'Aviso',                 ZH: '公告',    AR: 'إشعار',         FR: 'Avis',               DE: 'Hinweis',             RU: 'Объявление',       JA: 'お知らせ',        KO: '공지'       },
  tutorials:        { EN: 'Tutorials',          PT: 'Tutoriais',              ES: 'Tutoriales',            ZH: '教程',    AR: 'دروس',           FR: 'Tutoriels',          DE: 'Anleitungen',         RU: 'Обучение',         JA: 'チュートリアル',  KO: '튜토리얼'   },
  invitation:       { EN: 'Invitation',         PT: 'Convite',                ES: 'Invitación',            ZH: '邀请',    AR: 'دعوة',           FR: 'Invitation',         DE: 'Einladung',           RU: 'Приглашение',      JA: '招待',            KO: '초대'       },
  training_progress:{ EN: 'Training progress',  PT: 'Progresso de treinamento',ES:'Progreso de entrenamiento',ZH:'训练进度',AR:'تقدم التدريب',  FR:"Progrès d'entraînement",DE:'Trainingsfortschritt', RU:'Прогресс обучения', JA:'トレーニング進捗',  KO:'훈련 진행률' },
  make_profit:      { EN: 'Make Profit',        PT: 'Obter Lucro',            ES: 'Obtener Ganancias',     ZH: '获取收益', AR:'تحقيق الأرباح',  FR:'Générer des profits',  DE:'Gewinn erzielen',      RU:'Заработать',        JA:'利益を得る',       KO:'수익 창출'   },
  node_partner:     { EN: 'Node Partner',       PT: 'Parceiro Nó',            ES: 'Socio Nodo',            ZH: '节点伙伴', AR:'شريك العقدة',    FR:'Partenaire Nœud',     DE:'Node-Partner',         RU:'Партнёр узла',      JA:'ノードパートナー',  KO:'노드 파트너' },
  partners:         { EN: 'Partners',           PT: 'Parceiros',              ES: 'Socios',                ZH: '合作伙伴', AR: 'الشركاء',        FR: 'Partenaires',        DE: 'Partner',             RU: 'Партнёры',         JA: 'パートナー',      KO: '파트너'     },
  total_earnings:   { EN: 'Total Earnings',     PT: 'Ganhos Totais',          ES: 'Ganancias Totales',     ZH: '总收益',  AR: 'إجمالي الأرباح', FR: 'Gains Totaux',       DE: 'Gesamtgewinn',        RU: 'Всего доход',      JA: '総収益',          KO: '총 수익'    },
  daily_yield:      { EN: 'Daily yield',        PT: 'Rendimento diário',      ES: 'Rendimiento diario',    ZH: '日收益',  AR: 'العائد اليومي',  FR: 'Revenu quotidien',   DE: 'Tagesertrag',         RU: 'Суточный доход',   JA: '日次収益',        KO: '일일 수익'  },
  total_yield:      { EN: 'Total yield',        PT: 'Rendimento total',       ES: 'Rendimiento total',     ZH: '总收益',  AR: 'العائد الكلي',   FR: 'Revenu total',       DE: 'Gesamtertrag',        RU: 'Всего доход',      JA: '総収益',          KO: '총 수익'    },
  notifications:    { EN: 'Notifications',      PT: 'Notificações',           ES: 'Notificaciones',        ZH: '通知',    AR: 'الإشعارات',      FR: 'Notifications',      DE: 'Benachrichtigungen',  RU: 'Уведомления',      JA: '通知',            KO: '알림'       },

  // ── Withdraw ──────────────────────────────────────────────────────────────
  withdraw_notice:      { EN: 'Withdrawals are processed to USDT (TRC-20) addresses only.', PT:'Os saques são processados apenas para endereços USDT (TRC-20).', ES:'Los retiros se procesan solo a direcciones USDT (TRC-20).', ZH:'提款仅处理到USDT (TRC-20)地址。', AR:'تتم معالجة السحوبات إلى عناوين USDT (TRC-20) فقط.', FR:'Les retraits sont traités vers des adresses USDT (TRC-20) uniquement.', DE:'Auszahlungen werden nur an USDT (TRC-20)-Adressen verarbeitet.', RU:'Вывод только на USDT (TRC-20) адреса.', JA:'出金はUSDT (TRC-20)アドレスのみ処理されます。', KO:'출금은 USDT (TRC-20) 주소로만 처리됩니다.'},
  minimum:              { EN: 'Minimum:',     PT: 'Mínimo:',    ES: 'Mínimo:',   ZH: '最低:',   AR: 'الحد الأدنى:',FR: 'Minimum:',  DE: 'Mindest:',       RU: 'Минимум:',          JA: '最低:',    KO: '최소:'   },
  network_fee:          { EN: 'Network fee', PT: 'Taxa de rede',ES: 'Tarifa de red',ZH:'网络费', AR: 'رسوم الشبكة',FR:'Frais réseau',DE: 'Netzwerkgebühr', RU: 'Комиссия сети',     JA: 'ネットワーク手数料',KO: '네트워크 수수료'},
  wallet_address:       { EN: 'Wallet Address (TRC-20)', PT:'Endereço da Carteira (TRC-20)', ES:'Dirección de Billetera (TRC-20)', ZH:'钱包地址 (TRC-20)', AR:'عنوان المحفظة (TRC-20)', FR:'Adresse du portefeuille (TRC-20)', DE:'Wallet-Adresse (TRC-20)', RU:'Адрес кошелька (TRC-20)', JA:'ウォレットアドレス (TRC-20)', KO:'지갑 주소 (TRC-20)'},
  wallet_placeholder:   { EN: 'Enter USDT TRC-20 address', PT:'Insira o endereço USDT TRC-20', ES:'Ingrese la dirección USDT TRC-20', ZH:'输入USDT TRC-20地址', AR:'أدخل عنوان USDT TRC-20', FR:'Entrez l\'adresse USDT TRC-20', DE:'USDT TRC-20 Adresse eingeben', RU:'Введите адрес USDT TRC-20', JA:'USDT TRC-20アドレスを入力', KO:'USDT TRC-20 주소 입력'},
  amount_label:         { EN: 'Amount (USDT)',  PT: 'Valor (USDT)', ES: 'Monto (USDT)', ZH: '金额 (USDT)', AR: 'المبلغ (USDT)', FR: 'Montant (USDT)', DE: 'Betrag (USDT)', RU: 'Сумма (USDT)', JA: '金額 (USDT)', KO: '금액 (USDT)'},
  you_receive:          { EN: 'You receive',    PT: 'Você recebe',  ES: 'Recibes',      ZH: '您将收到',    AR: 'ستستلم',         FR: 'Vous recevez', DE: 'Sie erhalten',  RU: 'Вы получите', JA: '受け取り額', KO: '수령액'},
  amount_label2:        { EN: 'Amount',         PT: 'Valor',        ES: 'Monto',        ZH: '金额',        AR: 'المبلغ',         FR: 'Montant',      DE: 'Betrag',        RU: 'Сумма',       JA: '金額',       KO: '금액'},
  withdrawal_submitted: { EN: 'Withdrawal Submitted',  PT: 'Saque Enviado',   ES: 'Retiro Enviado',   ZH: '提款已提交', AR:'تم تقديم طلب السحب', FR:'Retrait soumis', DE:'Auszahlung eingereicht', RU:'Вывод отправлен', JA:'出金が送信されました', KO:'출금이 제출되었습니다'},
  est_processing:       { EN: 'Est. processing', PT: 'Prazo estimado', ES: 'Tiempo estimado', ZH: '预计处理时间', AR:'وقت المعالجة المقدر', FR:'Traitement estimé', DE:'Geschätzte Bearbeitung', RU:'Ориентировочная обработка', JA:'処理目安', KO:'예상 처리 기간'},
  processing_days:      { EN: '1–3 business days', PT: '1–3 dias úteis', ES: '1–3 días hábiles', ZH: '1–3个工作日', AR:'1–3 أيام عمل', FR:'1 à 3 jours ouvrables', DE:'1–3 Werktage', RU:'1–3 рабочих дня', JA:'1〜3営業日', KO:'1–3 영업일'},
  another_withdrawal:   { EN: 'Make Another Withdrawal', PT: 'Fazer Outro Saque', ES: 'Hacer Otro Retiro', ZH: '再次提款', AR:'إجراء سحب آخر', FR:'Effectuer un autre retrait', DE:'Weitere Auszahlung', RU:'Ещё один вывод', JA:'もう一度出金', KO:'또 다른 출금'},
  being_processed:      { EN: 'withdrawal is being processed. You will receive', PT: 'saque está sendo processado. Você receberá', ES: 'retiro está siendo procesado. Recibirá', ZH: '提款正在处理中。您将收到', AR:'السحب قيد المعالجة. ستستلم', FR:'retrait est en cours de traitement. Vous recevrez', DE:'Auszahlung wird bearbeitet. Sie erhalten', RU:'вывод обрабатывается. Вы получите', JA:'出金が処理中です。受け取り金額:', KO:'출금이 처리 중입니다. 수령액:'},
}

/** Returns translated string for key in given lang, falling back to EN */
export function t(key: string, lang: LangCode | string): string {
  const row = T[key]
  if (!row) return key
  return row[(lang as LangCode)] ?? row['EN'] ?? key
}

export default T
