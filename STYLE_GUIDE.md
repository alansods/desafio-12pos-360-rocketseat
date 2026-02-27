# Financy — Style Guide

Referência visual extraída do [Figma](https://www.figma.com/design/EN1lPLOYS0baIPGH4CZjIq/Financy--Community-?node-id=3-377).

---

## Tipografia

| Propriedade | Valor |
|-------------|-------|
| Font Family | **Inter** |
| Fonte | [Google Fonts](https://fonts.google.com/specimen/Inter) |

---

## Cores

### Brand

| Token | Hex |
|-------|-----|
| `brand-dark` | `#124B2B` |
| `brand-base` | `#1F6F43` |

### Grayscale

| Token | Hex |
|-------|-----|
| `gray-800` | `#111827` |
| `gray-700` | `#374151` |
| `gray-600` | `#4B5563` |
| `gray-500` | `#6B7280` |
| `gray-400` | `#9CA3AF` |
| `gray-300` | `#D1D5DB` |
| `gray-200` | `#E5E7EB` |
| `gray-100` | `#F8F9FA` |

### Neutral

| Token | Hex |
|-------|-----|
| `black` | `#000000` |
| `white` | `#ffffff` |

### Feedback

| Token | Hex |
|-------|-----|
| `danger` | `#EF4444` |
| `success` | `#19AD70` |

### Colors

| Token | Hex | Token | Hex | Token | Hex |
|-------|-----|-------|-----|-------|-----|
| `blue-dark` | `#1D4ED8` | `blue-base` | `#2563EB` | `blue-light` | `#DBEAFE` |
| `purple-dark` | `#7E22CE` | `purple-base` | `#9333EA` | `purple-light` | `#F3E8FF` |
| `pink-dark` | `#BE185D` | `pink-base` | `#DB2777` | `pink-light` | `#FCE7F3` |
| `red-dark` | `#B91C1C` | `red-base` | `#DC2626` | `red-light` | `#FEE2E2` |
| `orange-dark` | `#C2410C` | `orange-base` | `#EA580C` | `orange-light` | `#FFEDD5` |
| `yellow-dark` | `#A16207` | `yellow-base` | `#CA8A04` | `yellow-light` | `#F7F3CA` |
| `green-dark` | `#15803D` | `green-base` | `#16A34A` | `green-light` | `#E0FAE9` |

---

## Componentes

### Input
Estados: `Empty` · `Active` · `Filled` · `Error` · `Disabled` · `Select`

- Possui label superior, ícone à esquerda, placeholder e helper text
- Estado `Error`: label e borda em vermelho (`danger`)
- Estado `Select`: dropdown com opções e checkmark na seleção ativa

### LabelButton
Variantes: `filled` (fundo verde brand) · `outlined` (borda + texto verde)

| Tamanho | Estados |
|---------|---------|
| `Md` | Default · Hover · Disabled |
| `Sm` | Default · Hover · Disabled |

### IconButton
Estados: `Default` · `Hover` · `Disabled`

### Link
Estados: `Default` · `Hover`

### PaginationButton
Estados: `Default` · `Hover` · `Active` (fundo brand-base) · `Disabled`

### Tag
Chips coloridos para categorias. Cores disponíveis: `blue` · `green` · `purple` · `red` · `orange` · `yellow` · `pink`

### Type
Indicador de tipo de transação:
- **Entrada** — ícone + texto verde (`success`)
- **Saída** — ícone + texto vermelho (`danger`)
