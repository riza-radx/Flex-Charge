# Flex Charge — Dashboard

White-label i platformes **RadX** per menaxhimin e rrjetit te karikimit te automjeteve
elektrike. Ndan te njejtin backend (`Radx-API`) me RadX-in dhe Vega Charging, por
ka brandim, port dhe kompani te vetat.

| | |
|---|---|
| Framework | Angular **15.2** (TypeScript 4.9) |
| UI | Bootstrap **4.5.2** + ngx-bootstrap 10.3 |
| Porti lokal | **4202** |
| `company_id` | **27** (Flex Charge) |
| Backend | `Radx-API` (repo i ndare) |

Brandimi dokumentohet i plote ne **[BRANDING.md](BRANDING.md)** — lexoje para se te
ndryshosh ngjyra ose asset-e.

---

## Kerkesat

Sipas `engines` te `@angular/cli@15.2.11` te instaluar:

- **Node.js** — `^14.20.0 || ^16.13.0 || >=18.10.0`
  Kufiri i sipërm eshte i hapur, ndaj cdo Node ≥ 18.10 vlen. U testua me **v24.19.0**.
- **npm** — `^6.11.0 || ^7.5.6 || >=8.0.0` (u testua me 11.17.0)
- Angular CLI nuk kerkohet globalisht — perdor `npx ng` ose skriptet e `package.json`.

## Instalimi

```bash
cd FlexCharge
npm install
```

Nese `node_modules` prishet:

```bash
npm run install:clean    # fshin node_modules + package-lock, riinstalon dhe nis
```

> ⚠️ `install:clean` perdor `rm -rf`, ndaj ne Windows kerkon Git Bash / WSL, jo
> PowerShell.

## Nisja lokale

```bash
npm start                 # ng serve --port 4202
```

Hapet te **http://localhost:4202**

Portet e perdorura ne repo-t vellezer — mos i ngaterro:

| Porti | Projekti |
|---|---|
| 4200 | RadX (`RadX-Frontend`) |
| 4201 | Vega Charging (`VegaCharging`) |
| **4202** | **Flex Charge** |

`proxy.conf.json` merret automatikisht nga `angular.json` (`serve.proxyConfig`) —
proxy-on `/documents` drejt `https://app.radx.app`.

## Varesia nga backend-i

Front-end-i i vetem **nuk mjafton** per login. `src/environments/environment.ts`
tregon te `http://localhost:3000`, ku duhet te punoje `Radx-API`.

> ⚠️ **Kujdes:** `.env` i `Radx-API` tregon te MySQL-i i **prodhimit**. Domethene
> API-a e nisur "lokalisht" lexon dhe **shkruan** te dhena reale. Mos testo
> operacione shkrimi pa e ditur kete.

Per te punuar vetem me pamjen (ngjyra, logo, layout) nuk duhet backend — faqet e
login/register renderohen normalisht.

## Konfigurimi

Cdo gje specifike per brandin ndodhet ne 4 vende:

| Cfare | Skedari |
|---|---|
| `apiUrl` + `publicKey` (lokal) | `src/environments/environment.ts` |
| `apiUrl` + `publicKey` (live) | `src/environments/environment.prod.ts` |
| `companyId` (3 vende: register, login, forgot) | `src/app/services/authService/auth.service.ts` |
| Titulli, favicon, theme-color | `src/index.html` |

**E rendesishme:** `src/app/services/environment.ts` vetem **ri-eksporton** nga
`src/environments/`. Me pare ishte kopje e dyte me vlera te ngurta, keshtu qe
`ng build --prod` NUK e nderronte dot API-n. **Mos i shkruaj vlerat atje.**

### Mbetur per t'u konfiguruar

- **`publicKey`** — po perdoret ai i Vega-s. Tabela `authKeys` nuk ka rresht per
  `company_id = 27`. Shiko BRANDING.md per bug-un e `authKeysService.js`.
- **Domain-i live** — duhet per `whitelabel_url` ne DB, `environment.prod.ts` dhe
  `ALLOWED_ORIGINS` te `Radx-API/index.js`. `localhost:4202` eshte tashme i lejuar.

## Build

```bash
npm run build            # ng build — konfigurimi PRODUCTION si parazgjedhje
```

Output: `dist/`

`defaultConfiguration` e `angular.json` eshte `production`, dhe `fileReplacements`
zevendeson `environment.ts` → `environment.prod.ts`. Domethene **`npm run build`
ndertohet gjithmone me vlerat live** — per build zhvillimi:

```bash
npx ng build --configuration development
```

## Struktura

```
src/
├── app/
│   ├── components/          # sidebar, navbar, footer
│   ├── layouts/             # admin-layout (i loguar), auth-layout (login etc.)
│   ├── pages/               # faqet, te grupuara sipas domenit
│   │   ├── assets/          # chargers, locations, documents
│   │   ├── dashboards/      # nje dashboard per rol
│   │   ├── rates/           # rates, promo, vouchers, currency, taxes
│   │   ├── rfid-card/       # kartat RFID
│   │   ├── users/           # userat dhe grupet
│   │   └── examples/        # login, register, forgot/reset password, profile
│   ├── services/            # sherbimet HTTP, nje per domen
│   └── utils/               # eksportet Excel (companyReport, partnerReport, ...)
├── assets/
│   ├── flexcharge/          # asset-et e brandit + ikonat e menyse
│   ├── scss/
│   │   ├── custom/_variables.scss   # NGJYRAT — nis nga ketu
│   │   └── radx.scss                # pika hyrese e temes
│   └── img/
└── environments/
```

## Login dhe rolet

Login-i i white-label-it **nuk** eshte i njejti me te `app.radx.app`:

- Front-end-i poston te
  `/api/v1/auth/userloginfrowhitelabel/loginfromwhitelabel/:companyId`
  me `companyId` te ngurte ne `auth.service.ts`.
- Backend-i refuzon nese `user.company_id !== :companyId` → **"You can not login"**.
- Anasjelltas, login-i normal i `app.radx.app` refuzon userat e kompanive
  white-label (`is_whitelabel === 'true'`). Izolimi eshte i dyanshem.
- Useri duhet te kete **telefonin e verifikuar** — perndryshe
  *"Please Verify Your Phone Number"*.

Domethene per te hyre ne Flex Charge duhet nje user me `company_id = 27`.

Rolet perkufizohen ne `src/app/services/authGuard/roles.ts`. Sidebar-i ndryshon
sipas rolit te ruajtur ne `localStorage` (`userRole`, `cugpCred`).

## Problemet e njohura

Te gjeturat gjate brandimit — asnjera nuk vjen nga white-label-i, jane te
parapranishme edhe ne RadX/Vega:

- **Krijimi i charger-it deshton.** `valid` dhe `allowReservation` vijne nga
  checkbox-e si **boolean**, ndersa modeli i deklaron `DataTypes.STRING`;
  Sequelize 6 e refuzon boolean-in (`false is not a valid string`) dhe kthen
  *"Failed to create a new charger"*. Ne `onSubmit()` ekziston tashme konvertimi
  per `is_public` dhe `isHexReverse` — duhen shtuar edhe keto dy fusha.
- **Krijimi i rate-it deshton per rolet RadX.** `radxcreaterate.component.ts`
  therret `this.company.company_id`, por per `RadX_Admin`/`RADX_MODERATOR`
  mbushet `this.companies` (shumes) dhe `this.company` mbetet `undefined` →
  `TypeError`. Per rolet Company punon normalisht.
- **`rates.percentage` nuk perdoret** ne llogaritjen e cmimit — ruhet dhe lexohet
  vetem per shfaqje/eksport. `Promo` dhe `Taxes` kane `percentage` te tyre qe
  perdoren vertet.
- **Kod i vdekur:** komponentet `companyrate` / `companycreaterate` nuk kane route;
  `reate.component.html` renderon vetem `<app-radxrate>`. Klasa `custom-green` te
  `rfid-card-details` nuk eshte perkufizuar askund.
- **`ocpp_id` pa indeks unik** ne tabelen `charger` — dy stacione mund te
  regjistrohen me te njejtin ID dhe te perplasen ne routing-un OCPP.

## Shenime per git

`.gitignore` **perjashton `package-lock.json`**. Kjo e ben instalimin
jo-riprodhueshem (versione te ndryshme transitive per zhvillues te ndryshem). Nese
nuk ka arsye te qellimshme, hiqe nga `.gitignore` dhe commit-o lockfile-in.

Perjashtohen gjithashtu `/dist`, `/node_modules`, `/.angular` (cache) dhe
`.history/` — sic duhet.
