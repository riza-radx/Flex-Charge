# Flex Charge — White Label

Krijuar duke kopjuar `VegaCharging/`. Ky dokument mban gjurmen e cdo gjeje qe eshte
specifike per brandin, qe nje white-label i ardhshem te behet me shpejt.

## Konfigurimi

| Cfare | Ku | Gjendja |
|---|---|---|
| Porti lokal | `package.json` → `start: ng serve --port 4202` | OK |
| `company_id` | `src/app/services/authService/auth.service.ts` (3 vende: register, login, forgot) | **27** |
| API + publicKey | `src/environments/environment.ts` (lokal) dhe `environment.prod.ts` (live) | publicKey ende i Vega-s |
| Titulli + favicon + theme-color | `src/index.html` | OK |
| `favicon.ico` | `src/favicon.ico` | OK — rigjeneruar nga shenja "F" |
| Assets e brandit | `src/assets/flexcharge/` | 5 skedare mungojne |
| Ngjyrat | `src/assets/scss/custom/_variables.scss` | OK |

**E rendesishme:** `src/app/services/environment.ts` tani vetem ri-eksporton nga
`src/environments/`. Me pare ishte nje kopje e dyte me vlera te ngurta, keshtu qe
`ng build --prod` NUK e nderronte dot API-n. Mos i shkruaj vlerat atje.

Portet e perdorura: 4200 = RadX, 4201 = Vega, **4202 = Flex Charge**.

## Ngjyrat

| Variabel | Vlera | Shenim |
|---|---|---|
| `$primaryColor` / `$primary` / `$blue` | `#931623` | ish `#7fbc42` (jeshilja RadX/Vega) — 208 zevendesime ne `src/` |
| `$secondaryColor` | `#F87377` | i shtuar; gjeneron `.bg-secondaryColor`, `.text-secondaryColor`, `--secondaryColor` |
| `COLOR_BRAND` | `931623` | ish `COLOR_VEGA_GREEN`, ne 3 utils-et e Excel-it |
| `$gray-900` / `$black` / `$red` | `#022636` | navy neutral, i pandryshuar — nuk eshte ngjyre brandi |

`$secondary` (`#f7fafc`) NUK u prek — perdoret si sfond i lehte neper gjithe temen,
nuk eshte ngjyre brandi.

### Nuancat e tjera te jeshiles se Vega-s (16 vende, 10 nuanca)

Zevendesimi i `#7fbc42` NUK mjafton. Kishte nuanca te derivuara qe kerkimi me tekst
nuk i kap. Menyra e sakte e gjetjes: nxirr cdo hex/rgb nga `src/` dhe filtro sipas
**hue 62–112** (jo me grep te stringut). Keto u zevendesuan duke ruajtur ndricimin,
qe kontrasti i tekstit te mos prishet:

| Ish | Tani | Roli |
|---|---|---|
| `rgba(127, 188, 66, 0.6)` | `rgba(147, 22, 35, 0.6)` | fill i grafikeve (charger-details, energy-report) |
| `#5a9028` | `#6b1019` | border i grafikeve |
| `#2e5a1a` ×4 | `#5c0f18` | tekst i errët i theksuar (bursa-prices) |
| `#f0f8e8` ×2 | `#fcf0f2` | sfond rreshtash (bursa-prices) |
| `#e2f0cb` | `#f6d9dd` | sfond perzgjedhjeje (mngnotifications) |
| `#f6f9f3` | `#fdf7f8` | sfond gati i bardhe (transfer-money) |
| `#e0e8d8` | `#eed7da` | border i lehte (transfer-money) |
| `#eef7e3` | `#fdf0f2` | sfond preview (transfer-money) |
| `#d4e8b4` | `#eec9ce` | border preview (transfer-money) |
| `#c8d4b0` | `#e0bfc4` | border me pika (transfer-money) |

### `$success` = korali i logos — te 519 perdorimet nga 1 variabel

`$success: #e6575b` ne `custom/_variables.scss`. Nga ky variabel derivohen **519
perdorime te klasave `-success` ne 59 skedare**, sepse te gjitha gjenerohen nga
cikli mbi `$theme-colors` ne 8 partial-e bootstrap (`utilities/_background`,
`utilities/_text`, `utilities/_borders`, `_alert`, `_badge`, `_buttons`,
`_list-group`, `_tables`). **Mos i ndrysho ne HTML** — nje variabel i mbulon.

Ndarja e perdorimeve: `text-success` 225, `bg-success` 198, `badge-success` 69,
`alert-success` 12, `btn-success` 9, `btn-outline-success` 5, `table-success` 1.
Perdoren kryesisht per shigjeta trendi, pika statusi "Online", shenjues legjende
dhe progress-bar — jo per mesazhe suksesi.

Gjendja pas ndryshimit, e verifikuar ne CSS-in e ndertuar:

| Klasa | Vlera |
|---|---|
| `.bg-success` / `.text-success` | `#e6575b` |
| `.btn-success` / `.btn-outline-success` | `#e6575b` |
| `.alert-success` | `#ea7275` |
| `.badge-success` | sfond `#fbe5e6`, tekst `#ec1e24` |
| `.table-success` | `#f8d0d1` |
| `.btn-danger` / `.btn-primary` | `#931623` — i paprekur |
| `.bg-green` / `.text-green` | `#06c802` — i paprekur |

`$green` (#06C802) NUK u prek: e perdorin `.text-green`/`.bg-green`, emra literale
te ngjyrave, jo semantike.

**Pse koral e jo `$primaryColor`:** `$danger` = `$primaryColor` = `#931623`. Po te
ishte edhe `$success` i njejti, shigjeta e trendit lart, pika "Online" dhe alert-i
i gabimit do dukeshin identike. Korali i ruan te dallueshme.

Partial-i `custom/_brand-buttons.scss` u hoq — kur `$success` u be koral, butonat
e marrin vete ngjyren nga `$theme-colors`, ndaj mbishkrimi ishte i tepert.
Nje burim i vetem i vertetesise: `$success`.

### Historik: mbishkrimi i vjeter i butonave

`$primary` DHE `$danger` jane te dyja `#931623` ne kete teme, keshtu qe
`.btn-primary` e `.btn-danger` dalin identike. Po u bere edhe `.btn-success` e
njejta, CDO buton do ishte i njejti ton dhe humbet hierarkia. Prandaj butonat e
veprimit pozitiv marrin **`#e6575b`** — korali i nxjerre direkt nga `logo.jpeg`
(rgb 230,87,91).

Zbatuar ne `src/assets/scss/custom/_brand-buttons.scss`, i importuar **i fundit**
ne `radx.scss` qe te mbishkruaje ciklin `@each $color, $value in $theme-colors`
te `bootstrap/_buttons.scss`. Perdor te njejtat mixin-e (`button-variant`,
`button-outline-variant`), keshtu hover/focus/active/disabled derivohen vetvetiu —
mos i shkruaj me dore.

Gjendja e fundit ne CSS: `.btn-success` dhe `.btn-outline-success` = `#e6575b`;
`.btn-primary` dhe `.btn-danger` = `#931623`.

Gjithashtu `confirmButtonColor` i sweetalert-it te `bursa-prices.component.ts`
(ish `#28a745`) → `#e6575b`.

**Kontrasti:** teksti i bardhe mbi `#e6575b` jep raport **3.57:1**. Kalon WCAG AA
per tekst te madh/bold, por NUK kalon pragun 4.5:1 per tekst normal. Nese duhet
pajtueshmeri e plote, duhet nje koral me i errët; ndrysho vetem `$brandSuccess`
ne `_brand-buttons.scss`.

### Jeshilet qe DUHEN lene jeshile (29 vende)

Vendim i marre me qellim: keto nuk jane ngjyra brandi, jane **kuptimore** — sukses,
"Active", cmim ne rritje, karikues i lire. Ne kete teme `$danger` eshte caktuar
`= $primaryColor`, keshtu qe gabimet tashme shfaqen `#931623`. Po u bene te kuqe
edhe keto, alert-i "u ruajt me sukses" do dukej identik me nje gabim.

`.alert-success` (`#2ed12a`) dhe `.badge-success` (`#73fe70`) u verifikuan se
mbeten jeshile pas ndryshimit te butonave.

- `#28a745` ×6 — badge "Active" (radxrate, rate-details), cmim pozitiv
- `#d4edda`, `#155724`, `#198754` — alert-e suksesi
- `#34a853` ×2 — popup i suksesit (`_popup.scss`)
- `#4caf50`, `#2e7d32`, `#e8f5e9`, `#e0f7e0` — statuse OK
- `$green` (`#06c802`), `$cyan`, `$slack`, `#20c997`, `#24b47e`, `#76eea7`, `#74e4a2`,
  `#008169`, `#2dce89` — variabla teme / kalendar / grafik

## Assets qe duhen vendosur ne `src/assets/flexcharge/`

### Ikonat e menyse — RIKOLORUAR

9 ikonat (`dashboard`, `users`, `company`, `partner`, `card`, `rate`, `assets`,
`monitoring`, `notification`) ishin **line-art monokrom `rgb(127,188,66)`** = `#7fbc42`,
jeshilja e Vega-s. Zevendesimi ne SCSS/HTML nuk i prek — jane PNG.

Anti-aliasing-u i tyre behet me **alfa te pjesshme**, jo me nuanca me te lehta te
jeshiles. Kjo e ben rikolorimin pa humbje: mbaj alfen e paprekur, ndrysho vetem RGB
te pikselat ku e gjelbra dominon (`G > R && G > B`). Rezultati: `#931623` me AA
identik me origjinalin.

### Ikona `flash.png` — dy variante, me qellim

`src/assets/img/icons/charger/flash.png` ishte gjithashtu `rgb(127,188,66)`.
Perdorej ne **10 vende** neper 5 faqe, ne dy sfonde te KUNDERTA:

| Perdorimi | Sfondi | Varianti |
|---|---|---|
| `class="charging-flash"` — brenda `.charging-status-circle` | `#931623` (i kuq) | `flash-white.png` (i bardhe) |
| `alt="Battery Icon"` — ne `.charging-time` | `#ffffff` (karta) | `flash.png` (`#931623`) |

Nje skedar i vetem nuk i sherben dot te dyve: po e bere te kuq, brenda rrethit te
kuq behet i padukshem. Prandaj u krijuan dy dhe u ndryshuan 5 rreshtat me
`class="charging-flash"`. Faqet: `companylocations`, `charging-status`,
`companymonitoring`, `partnermonitoring`, `radxmonitoring`.

### Imazhe me jeshile qe u LANE me qellim

Skanimi i 101 imazheve rasterike nxori keto; asnjeri nuk eshte ngjyre brandi:

| Skedari | Pse mbetet |
|---|---|
| `assets/file/excel-logo.png` | logo e Microsoft Excel — produkt i palës së trete |
| `assets/img/theme/vue.jpg` | logo e Vue.js — produkt i palës së trete |
| `assets/img/cpmappinavaible.png` | pin "available" i mapes, ciankë `rgb(0,255,218)` — jo jeshilja e brandit, dhe cift me `cpmappinoffline.png` |
| `assets/img/theme/team-4.jpg` | foto stok (demo Creative Tim) |
| `assets/img/stations/car-charging-station.jpg` + `icons/actionsStation/` | foto reale, e gjelbra eshte bimesi |

Brandi dha `logo.jpeg` (601×180, JPEG, sfond `#f7f7f7`). Nga ky u gjeneruan:

| Skedari | Dimensione | Ku perdoret | Gjendja |
|---|---|---|---|
| `logo.png` | 601×180 ARGB | logo e sidebar-it, faqja presentation, faqet e auth-it | GJENERUAR |
| `logo-nobg.png` | 601×180 ARGB | logo ne PDF-te e faturave (`financialdetails`) | GJENERUAR (identik me logo.png) |
| `favicon.png` | 512×512 | favicon te `index.html` | GJENERUAR (shenja "F") |
| `logo-white.png` | 601×180 ARGB | variant me tekst te bardhe per sfonde te erret | GJENERUAR, PA REFERENCA ne kod |
| `src/favicon.ico` | 16/32/48/64/128/256 | ikona e tab-it qe browser-i kerkon si parazgjedhje ne `/favicon.ico` | GJENERUAR |
| `card-background.png` | 1600×1131 | sfondi i kartes ne profile, user-details, rfid-card-details, voucherdetails | GJENERUAR |
| `login-background.jpeg` | ~1600×846 | sfondi i login / register / forgot / reset password | **MUNGON** |

### `card-background.png` — i gjeneruar

Gradient diagonal `#931623` → `#e6575b` plus dy rrathe gjysme-transparent per
thellesi. Raporti **1.4147**, i njejti me te Vega-s (4962×3509 = 1.4141), qe
`.card-content` — i pozicionuar absolut me `color: white` — te mos e ndryshoje
lartesine e kartes.

**PA watermark te "F"-se, me qellim.** Provuar dhe hedhur: shkallezimi i
`favicon.png` ne 16% alfa nxjerr speckle te dukshem. Shkaku eshte se burimi i
logos eshte JPEG, dhe pikselat-artefakte gri rreth shenjes jane **opak**
(alfa 255) — ndaj kufizimi i alfes NUK i heq. Do duhej maske me dore ose logo
SVG/PNG origjinale nga brandi.

Kur brandi jep dizajnin e vertete te kartes, zevendesoje skedarin.

### Si u hoq sfondi (per referenca)

Sfondi i JPEG-ut eshte `#f7f7f7` (247,247,247), ndersa vijat e "F"-se jane `#ffffff`
(255) — keshtu qe **kufi i thjeshte ndricimi i shpon vijat e F-se**. Zgjidhja:
kyc vetem piksela grije brenda ±6 nga 247 (`|255−247| = 8 > 6`, ndaj e bardha e
paster mbrohet), plus test grije `max−min ≤ 8` qe korali te mos preket.

Provoj i pari flood-fill nga buzet, por ai la brendesine e shkronjave "e", "a", "g"
gri — dukej si blloqe te bardha mbi sfond te errët. Kyci global i heq edhe ato.

**Kufizim:** burimi eshte JPEG, keshtu qe rreth buzeve te shkronjave mbeten
piksela-artefakte gri te lehta. Mbi te bardhe (sidebar) jane te padukshem; mbi
sfond te errët duken si "speckle". Per rezultat te paster duhet PNG/SVG origjinal
nga brandi.

### Pse tab-i tregonte ikonen e gabuar

`index.html` e ka `<link rel="icon" href="assets/flexcharge/favicon.png">`, POR
browser-at kerkojne gjithashtu `/favicon.ico` si parazgjedhje, dhe
`angular.json` → `assets` permban `src/favicon.ico`. Ai skedar ishte ende ikona e
RadX-it (16x16 + 32x32). U rigjenerua nga shenja "F" me 6 madhesi
(16/32/48/64/128/256), me payload PNG brenda ICO-s.

Nese ikona e vjeter mbetet ne tab, eshte cache i browser-it — hard-refresh.

## Mbetur per t'u vendosur

- **Domain-i live** — ne DB `company.whitelabel_url` per company_id 27 mban ende
  placeholder-in `www.testtddt.com`. Duhet i vertete per:
  1. `whitelabel_url` ne DB (linku i reset-password + URL-te e pagesave Pok)
  2. `apiUrl` te `environment.prod.ts`
  3. `ALLOWED_ORIGINS` te `Radx-API/index.js` (~rreshti 160). `localhost:4202` OK.
- **`publicKey` i Flex Charge** — tani po perdoret ai i Vega-s. NUK ekziston rresht
  ne tabelen `authKeys` per company_id 27 (vetem nje rresht gjithsej, i Vega-s).
  Shiko bug-un me poshte.
- **`whitelabel_expiration_date`** — `null` per company_id 27. Nuk e bllokon login-in
  sot, por vendose.
- **Useri i pare** — nuk ka asnje user me `company_id = 27`. Pa te, login-i kthen
  "You can not login".

## Bug: `authKeys` nuk krijohet kur ruan kompanine

`Radx-API/service/authKeysService.js` e krijon rreshtin pa `company_id`, ndersa
`model/authKeys.js` e ka `allowNull: false`. Error-i kapet me `console.log`, keshtu
qe deshtimi kalon ne heshtje. Kjo shpjegon pse company_id 27 nuk ka rresht ne
`authKeys`. Duhet ose insert manual, ose `createAuthKeys(url, companyId)`.

## Si funksionon izolimi i login-it (per referenca)

- Front-end-i poston te `/api/v1/auth/userloginfrowhitelabel/loginfromwhitelabel/:companyId`
  me `companyId` te ngurte ne `auth.service.ts`.
- `Radx-API/controller/authController.js` (~r.235) refuzon nese
  `user.company_id !== :companyId` → "You can not login".
- `service/authService.js` `userLogin` (login-i normal i app.radx.app) refuzon userat
  e kompanive white-label (`is_whitelabel === 'true'`). Ky eshte izolimi i dyanshem.
- `userLoginFromWhitelabel` kerkon `isPhoneVerified` truthy — perndryshe
  "Please Verify Your Phone Number".

## Tekst i mbetur me brandin Vega

Keto nuk u prekën sepse lidhen me logjike biznesi, jo thjesht me pamje:

- `src/app/utils/partnerReportExcel.ts` — raporti i partnerit e ka "VEGA CHARGING"
  si palen tjeter ne faturim (`FATURIM ... NDAJ VEGA CHARGING`, `DETYRIM ...`,
  ndarja e fitimit). Duhet vendosur nese Flex Charge eshte operatori ne keto raporte.
- `Vega Staff` / `VEGA STAFF` — etiketa te lidhura me fushen `is_vega_staff` te backend-it
  (`user-group-details`, `companyupdateusergroup`, `radxcreateusergroup`, `partnerReportExcel`).
  Ndryshimi i etiketes eshte kozmetik; ndryshimi i fushes prek API-n.

## Klasa e vdekur: `custom-green`

`rfid-card-details.component.html` perdor `class="... custom-green ..."` ne 2 badge
(username dhe user group), por **`custom-green` nuk eshte perkufizuar askund** —
jo ne SCSS, jo ne CSS, jo ne styles inline te komponentit. Ndaj ato dy badge
renderohen pa sfond. Nuk eshte ceshtje ngjyrash brandi, por duket e paperfunduar.
Zevendesoje me nje klase reale (psh. `badge-primary`) ose perkufizoje.

## Ceshtje te perbashketa me RadX (jo specifike te white-label-it)

- **Email-i i reset-password** — `Radx-API/config/resendConfig.js`
  `sendRessetPasswordEmailWhiteLabel` ka subject `"Radx Reset Password"` dhe template
  RadX per te gjithe white-label-at. Do te duhej per-company.
- **Google Maps** — `src/index.html` ka `key=YOUR_API_KEY_HERE` (i njejte edhe ne Vega).
- `angular.json` → `defaultProject: "radx-project"` (kozmetik).
- Faqja `presentation` terheq imazhe nga GitHub-i i Creative Tim.

## Te kryera

- Asset-et e brandeve te tjera (`src/assets/vega/`, `vegacharging/`, `pavilion/`)
  u fshine — nuk kishin referenca ne kod.
- `dist/` e vjetruar (e kopjuar nga Vega) u fshi dhe u rindertua.
- `index.html` — u hoq boilerplate-i i Creative Tim (author + description).
- Blloqet me logon/footer-in RadX ne `auth-layout.component.html` dhe
  `footer.component.html` jane te komentuara — nuk renderohen, nuk u prekën.
