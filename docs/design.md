# 技術設計

> 最終更新: 2026-04-03
> ステータス: Draft v1.0

---

## アーキテクチャ

### 技術スタック

| レイヤー | 採用技術 | 理由 |
|---------|---------|------|
| フレームワーク | **Next.js 14**（App Router + SSG） | `generateStaticParams` でビルド時全ページ生成。サブページ展開時の拡張性が高い |
| スタイル | **TailwindCSS v3** | モックHTML（pattern-a/b/c）のユーティリティクラス設計と相性が良い |
| データ管理 | **JSON ファイル**（`/data/` 配下） | CMS不要。Git管理でバージョン追跡可能 |
| デプロイ | **Vercel**（本番）/ GitHub Pages（モック確認用） | Vercel: 自動プレビューデプロイ・Edge Functions対応 |
| 計測 | **GTM + GA4 + Microsoft Clarity** | GTM経由でGA4/ASPコンバージョン・Clarity(ヒートマップ)を一元管理 |

### 構成図

```
hikaku-affiliate/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # グローバルレイアウト（GTM設置）
│   ├── page.tsx                  # トップページ（カテゴリ一覧）
│   ├── credit-card/
│   │   ├── page.tsx              # クレカ総合比較
│   │   ├── no-fee/page.tsx       # 年会費無料
│   │   ├── high-return/page.tsx  # 高還元率
│   │   └── gold/page.tsx         # ゴールドカード
│   ├── hikari/
│   │   ├── page.tsx              # 光回線総合
│   │   ├── mansion/page.tsx      # マンション向け
│   │   ├── house/page.tsx        # 戸建て向け
│   │   └── cheap/page.tsx        # 月額安い回線
│   ├── sim/
│   │   ├── page.tsx              # 格安SIM総合
│   │   ├── data-plan/page.tsx    # データ容量別
│   │   ├── docomo/page.tsx       # ドコモ回線
│   │   └── mnp/page.tsx          # MNP乗り換え
│   └── nisa/
│       ├── page.tsx              # NISA総合
│       ├── beginner/page.tsx     # 初心者向け
│       ├── tsumitate/page.tsx    # つみたて特化
│       └── free-etf/page.tsx     # 手数料無料ETF
├── components/
│   ├── common/                   # 共通コンポーネント
│   └── widgets/                  # シミュレーター等
├── data/                         # 商材データJSON
├── lib/                          # ユーティリティ
├── public/                       # 静的アセット
└── docs/                         # 仕様ドキュメント（本ファイル等）
```

---

## データ設計

### クレジットカード（`/data/credit-cards.json`）

```json
{
  "cards": [
    {
      "id": "rakuten-card",
      "rank": 1,
      "name": "楽天カード",
      "official_name": "楽天カード",
      "image": "/images/cards/rakuten-card.webp",
      "tags": ["年会費無料", "高還元", "楽天市場"],
      "annual_fee": 0,
      "annual_fee_label": "永年無料",
      "cashback_rate": 1.0,
      "cashback_rate_label": "1.0%〜",
      "brand": ["Visa", "Mastercard", "JCB", "AMEX"],
      "campaign_bonus": 8000,
      "campaign_bonus_label": "最大8,000ポイント",
      "campaign_end": "2026-04-30",
      "insurance": {
        "travel_overseas": true,
        "travel_domestic": false,
        "shopping": true
      },
      "merits": ["年会費永年無料", "楽天市場で還元率3%", "新規入会キャンペーン充実"],
      "demerits": ["楽天以外は還元率1%", "ETCカードは年会費550円"],
      "recommend_for": "楽天経済圏を利用している方",
      "editorial_note": "コスパ最強の定番カード。楽天市場での買い物が多い方は特にお得。",
      "asp_url": "https://example-asp.com/click/rakuten-card?utm_source=hikaku&utm_medium=table",
      "asp_id": "ASP-001",
      "is_pr": true,
      "category": ["general", "no-fee", "high-return"],
      "updated_at": "2026-04-01"
    }
  ]
}
```

### 光回線（`/data/hikari.json`）

```json
{
  "providers": [
    {
      "id": "nuro-hikari",
      "rank": 1,
      "name": "NURO光",
      "type": ["house", "mansion"],
      "monthly_fee": {
        "house": 5200,
        "mansion": 2090
      },
      "monthly_fee_label": {
        "house": "5,200円/月",
        "mansion": "2,090円/月"
      },
      "max_speed": 10000,
      "max_speed_label": "10Gbps",
      "avg_speed_down": 608.2,
      "avg_speed_up": 512.4,
      "ping": 8,
      "contract_period": 2,
      "campaign_cashback": 55000,
      "campaign_cashback_label": "最大55,000円キャッシュバック",
      "available_areas": ["東京", "神奈川", "埼玉", "千葉", "大阪", "兵庫", "京都", "奈良"],
      "merits": ["国内最速クラス10Gbps", "高額キャッシュバック", "開通工事費無料"],
      "demerits": ["提供エリアが限定的", "工事まで時間がかかる場合あり"],
      "asp_url": "https://example-asp.com/click/nuro?utm_source=hikaku&utm_medium=table",
      "is_pr": true
    }
  ]
}
```

### 格安SIM（`/data/sim.json`）

```json
{
  "plans": [
    {
      "id": "ahamo",
      "rank": 1,
      "name": "ahamo",
      "carrier": "docomo",
      "network": "docomo",
      "pricing": [
        {"data_gb": 20, "price": 2970, "price_label": "2,970円"},
        {"data_gb": 100, "price": 4950, "price_label": "4,950円"}
      ],
      "call_options": {
        "free": "5分かけ放題込み",
        "unlimited_add": 1100
      },
      "min_contract_months": 0,
      "five_g": true,
      "esim": true,
      "merits": ["大手キャリア品質", "5分かけ放題込み", "縛りなし"],
      "demerits": ["店舗サポートなし", "家族割なし"],
      "mnp_guide": "申込→SIM到着→開通手続きの3ステップ（最短1日）",
      "asp_url": "https://example-asp.com/click/ahamo",
      "is_pr": true
    }
  ]
}
```

### NISA・証券口座（`/data/nisa.json`）

```json
{
  "accounts": [
    {
      "id": "sbi-securities",
      "rank": 1,
      "name": "SBI証券",
      "nisa_types": ["tsumitate", "growth", "both"],
      "tsumitate_limit_annual": 1200000,
      "growth_limit_annual": 2400000,
      "trade_fee_domestic": 0,
      "trade_fee_us": 0,
      "free_etf_count": 2591,
      "point_program": ["Tポイント", "Vポイント", "Pontaポイント"],
      "app_rating": 4.2,
      "account_opening_days": 3,
      "campaign_bonus": 3000,
      "merits": ["国内株・米国株手数料無料", "豊富なファンドラインナップ", "ポイント投資対応"],
      "demerits": ["画面がやや複雑", "IPO当選率は高くない"],
      "beginner_score": 4,
      "asp_url": "https://example-asp.com/click/sbi",
      "is_pr": true
    }
  ]
}
```

### ASPリンク管理（`/data/asp-links.json`）

```json
{
  "links": {
    "rakuten-card": {
      "asp_name": "A8.net",
      "program_id": "a8-00001",
      "base_url": "https://px.a8.net/svt/ejp?a8mat=...",
      "utm_defaults": {
        "utm_source": "hikaku-affiliate",
        "utm_medium": "affiliate",
        "utm_campaign": "credit-card"
      },
      "reward_per_cv": 8000,
      "cookie_days": 30,
      "updated_at": "2026-04-01"
    }
  }
}
```

### FAQ・コンテンツ管理（`/data/faq/credit-card.json`）

```json
{
  "page": "credit-card",
  "faqs": [
    {
      "q": "クレジットカードの審査に落ちやすい人の特徴は？",
      "a": "勤続年数が短い方、収入が不安定な方、他のクレジットカードやローンの延滞履歴がある方は審査が厳しくなる傾向があります。学生・主婦向けカードや審査通過率の高いカードを選ぶのがおすすめです。"
    }
  ]
}
```

---

## コンポーネント設計

### ComparisonTable（共通比較表）

```
Props:
  - products: Product[]       // 商材データ
  - columns: ColumnDef[]      // 表示カラム定義
  - defaultSort: string       // デフォルトソートキー
  - filters: FilterDef[]      // フィルタ定義（商材別）
  - maxRows?: number          // 表示行数（デフォルト: 全件）

機能:
  - カラムクリックでソート（昇順/降順トグル）
  - フィルタバーと連動したリアルタイム絞り込み
  - 各行末にCTAボタン配置
  - モバイルでは横スクロール + スワイプヒント表示
  - スティッキーヘッダー行
```

### ProductCard（商品詳細カード）

```
Props:
  - product: Product
  - rank: number
  - showMeritDemerit?: boolean  // デフォルト: true
  - variant?: 'default' | 'compact'

構成要素（モックのUI要素を継承）:
  - ランクバッジ（1位=金/2位=銀/3位=銅、pattern-aと同デザイン）
  - 商品名 + タグ行（カラーバッジ複数）
  - スペックグリッド（2列）: 年会費/還元率 or 速度/料金等
  - おすすめ対象ハイライトボックス（pattern-aの .card-recommend 継承）
  - メリット/デメリット（+ / - アイコン付き）
  - CTAボタン（全幅）
```

### FilterBar（フィルタ・ソート）

```
Props:
  - filters: FilterDef[]
  - activeFilters: Record<string, string[]>
  - onChange: (filters) => void
  - sortOptions: SortOption[]

表示形式:
  - デスクトップ: 横並びセレクトボックス or チェックボックスグループ
  - モバイル: 横スクロールのピル形ボタン
  - アクティブフィルタ数をバッジで表示
  - 「条件をリセット」ボタン
```

### SimulatorWidget（各商材のシミュレーター）

#### PointCalculator（クレカ）
```
入力: 月間利用金額（数値入力、スライダー）
出力: 年間獲得ポイント数、相当金額（円換算）
計算式: 利用額 × 還元率 × 12
表示: 各カードの年間獲得額を横棒グラフで比較
```

#### FeeSimulator（格安SIM）
```
入力: データ容量（レンジスライダー: 0〜50GB）+ 通話オプション（チェックボックス）
出力: 各プランの月額料金をリアルタイム更新
表示: 比較表の料金列をインタラクティブに更新
```

#### AssetSimulator（NISA）
```
入力: 月積立額 / 想定年利回り / 運用年数
出力: 最終積立額・運用益の複利グラフ（Chart.jsまたはrecharts）
計算式: 複利計算（Future Value of Annuity）
注釈: 「シミュレーションは将来の運用成果を保証するものではありません」
```

### CTAButton（ASPリンク付きボタン）

```
Props:
  - product: Product
  - position: string     // 'table' | 'card' | 'section-end' | 'float'
  - size?: 'sm' | 'md' | 'lg'
  - variant?: 'primary' | 'outline'

機能:
  - UTMパラメータを動的生成してASP URLに付与
  - クリック時にGTMカスタムイベント `cta_click` を発火
  - `data-product`, `data-position`, `data-category` 属性を自動付与
  - `target="_blank" rel="noopener noreferrer"` 固定
```

### FAQAccordion

```
Props:
  - faqs: FAQ[]
  - initialOpenIndex?: number   // デフォルト: -1（全閉）

機能:
  - クリックで開閉（CSS max-height transition）
  - 複数同時展開可
  - JSON-LD FAQPage スキーマを `<script>` として出力
```

### Breadcrumb

```
Props:
  - items: { label: string; href?: string }[]

機能:
  - BreadcrumbList JSON-LD を出力
  - 現在ページ（末尾）はリンクなし
```

---

## ページ設計（URL設計含む）

| URL | ページ名 | 対象ユーザー |
|-----|---------|------------|
| `/` | トップ（カテゴリ一覧） | 商材未決定の比較検討者 |
| `/credit-card/` | クレカ総合比較 | クレカ全般を比較したい |
| `/credit-card/no-fee/` | 年会費無料カード | 年会費を払いたくない |
| `/credit-card/high-return/` | 高還元率カード | ポイントを最大化したい |
| `/credit-card/gold/` | ゴールドカード | ステータス・保険目的 |
| `/hikari/` | 光回線総合比較 | 光回線全般を比較したい |
| `/hikari/mansion/` | マンション向け光回線 | 集合住宅に住んでいる |
| `/hikari/house/` | 戸建て向け光回線 | 一戸建てに住んでいる |
| `/hikari/cheap/` | 月額料金が安い光回線 | コスト最優先 |
| `/sim/` | 格安SIM総合比較 | 格安SIM全般を比較したい |
| `/sim/data-plan/` | データ容量別SIM比較 | 使う容量から選びたい |
| `/sim/docomo/` | ドコモ回線格安SIM | ドコモ品質で安くしたい |
| `/sim/mnp/` | MNP乗り換えガイド | 今すぐ乗り換えたい |
| `/nisa/` | NISA口座総合比較 | NISA口座を選びたい |
| `/nisa/beginner/` | NISA初心者向け | NISAを始めたい初心者 |
| `/nisa/tsumitate/` | つみたて投資枠特化 | 積立運用メイン |
| `/nisa/free-etf/` | 手数料無料ETF対応 | 低コスト運用重視 |

---

## デザインシステム

### カラートークン（pattern-a ベース、主力テーマ）

```css
:root {
  /* ブランドカラー */
  --color-primary: #2563EB;        /* アクセントブルー（CTAボタン等）*/
  --color-primary-dark: #1D4ED8;
  --color-primary-light: #EFF6FF;

  /* テキスト */
  --color-text-base: #1E293B;      /* 本文 */
  --color-text-muted: #64748B;     /* サブテキスト */
  --color-text-hint: #94A3B8;      /* ヒント・日付等 */

  /* 背景 */
  --color-bg-page: #F8FAFC;
  --color-bg-card: #FFFFFF;
  --color-bg-section: #F1F5F9;

  /* ランキング */
  --color-rank-1: #FFD700;
  --color-rank-2: #C0C0C0;
  --color-rank-3: #CD7F32;

  /* バッジ */
  --color-badge-hot-bg: #FEE2E2;
  --color-badge-hot-text: #991B1B;
  --color-badge-new-bg: #DCFCE7;
  --color-badge-new-text: #166534;
  --color-badge-pr-bg: #FEF9C3;
  --color-badge-pr-text: #92400E;

  /* ボーダー */
  --color-border: #E2E8F0;
  --color-border-light: #F1F5F9;
}
```

### タイポグラフィ

```css
/* フォント */
font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Hiragino Kaku Gothic ProN', sans-serif;

/* サイズスケール */
--text-xs:   0.7rem;    /* 11.2px  PRバッジ・補足 */
--text-sm:   0.82rem;   /* 13.1px  テーブルセル・カードスペック */
--text-base: 0.9rem;    /* 14.4px  本文 */
--text-md:   1.0rem;    /* 16px    カード商品名 */
--text-lg:   1.1rem;    /* 17.6px  カードメインタイトル */
--text-xl:   1.4rem;    /* 22.4px  セクションタイトル */
--text-hero: clamp(1.5rem, 4vw, 2.2rem);   /* H1 */
```

### スペーシング

```css
/* セクション padding */
section { padding: 40px 0; }

/* コンテナ */
.container { max-width: 1100px; margin: 0 auto; padding: 0 16px; }

/* カードグリッド */
.cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px; }

/* カード内部 */
.card { padding: 24px; border-radius: 12px; }
```

### コンポーネント一覧

| コンポーネント | ファイルパス | 備考 |
|--------------|------------|------|
| ComparisonTable | `components/common/ComparisonTable.tsx` | ソート・フィルタ対応 |
| ProductCard | `components/common/ProductCard.tsx` | pattern-aのカードUIベース |
| FilterBar | `components/common/FilterBar.tsx` | 商材別フィルタ定義を注入 |
| CTAButton | `components/common/CTAButton.tsx` | UTMパラメータ自動付与 |
| FAQAccordion | `components/common/FAQAccordion.tsx` | JSON-LD出力込み |
| Breadcrumb | `components/common/Breadcrumb.tsx` | JSON-LD出力込み |
| SectionTitle | `components/common/SectionTitle.tsx` | 左アクセントバー付きタイトル |
| PRBadge | `components/common/PRBadge.tsx` | 景品表示法対応 |
| RankBadge | `components/common/RankBadge.tsx` | 1-3位+その他 |
| PointCalculator | `components/widgets/PointCalculator.tsx` | クレカ専用 |
| SpeedBar | `components/widgets/SpeedBar.tsx` | 光回線専用 |
| DataSlider | `components/widgets/DataSlider.tsx` | 格安SIM専用 |
| AssetSimulator | `components/widgets/AssetSimulator.tsx` | NISA専用 |
| FloatCTA | `components/widgets/FloatCTA.tsx` | モバイル固定CTA |

---

## 広告計測設計

### GTMイベント設計

| イベント名 | トリガー | 付随パラメータ |
|-----------|---------|--------------|
| `cta_click` | CTAボタンクリック | `product_id`, `product_name`, `category`, `position`, `rank` |
| `filter_change` | フィルタ変更 | `filter_key`, `filter_value`, `category` |
| `simulator_use` | シミュレーター操作 | `simulator_type`, `input_value` |
| `faq_open` | FAQ展開 | `faq_index`, `faq_question_preview` |
| `scroll_depth` | スクロール深度 | `depth` (25/50/75/100%) |
| `tab_change` | タブ切替 | `tab_name`, `category` |

### GA4カスタムイベント

```javascript
// CTAクリック時の計測例
gtag('event', 'cta_click', {
  product_id: 'rakuten-card',
  product_name: '楽天カード',
  category: 'credit-card',
  position: 'card',
  rank: 1,
  campaign_bonus: 8000
});
```

### コンバージョントラッキング

- GA4 コンバージョン: `cta_click` イベントをコンバージョンとして設定
- Google広告: GTM経由でコンバージョンタグ設置（リスティング広告の最適化用）
- Microsoft Clarity: ヒートマップ・セッションレコーディング（CTAクリック分布の分析）
- ASP管理画面: ASP側のCV数との突合（週次）

### UTMパラメータ設計

```
utm_source=hikaku-affiliate
utm_medium=affiliate
utm_campaign={category}          # credit-card / hikari / sim / nisa
utm_content={product_id}-{position}   # rakuten-card-table
```
