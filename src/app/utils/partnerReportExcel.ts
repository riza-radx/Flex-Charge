/**
 * Partner Report Excel — multi-sheet:
 *   Sheet 1: General              — te gjitha karikimet e partnerit (detail)
 *   Sheet 2: FATURE SHITJE_MM_YYYY — permbledhje e struktures se fatures:
 *       - Grupim per (Charger x REZULTATI I PIKES SIPAS KLIENTEVE x çmim shitje)
 *       - Total i shitjeve grand-total
 *       - Total per grupim (aggregate)
 *       - Kosto ENERGJI ELEKTRIKE grupuar per purchase rate unik
 *       - MARZHI BRUTO = Total Shitje - Total Kosto Energji
 *       - NDARJA FITIMIT: partner_split% -> partner, (100-partner_split)% -> Vega
 *       - FATURIMI MUJOR (2 seksione dyanshme) + FITIMI NETO + INFORMACION PAGESE
 *   Sheets 3..N: Nje sheet per çdo charger — sesionet e grupuara ne 4 seksione:
 *       KLIENT/ KOMPANI, VEGA STAFF, KLIENT FUNDOR, SHITJE ME KARTE CASH.
 *
 * Klasifikimi per sesion (nga backend row-fields shtuar tek `Generated Partner`):
 *   1. Nese UG mungon (usergr_id NULL)           → KLIENT FUNDOR
 *   2. Nese UG.is_vega_staff = true              → VEGA STAFF
 *   3. Nese UG.partner_id = reportPartnerId      → SHITJE ME KARTE CASH
 *   4. Perndryshe                                 → KLIENT/ KOMPANI
 *
 * Perdor `xlsx-js-style` qe styles-t (ngjyra, borders, num format, bold) te ruhen
 * ne file. Vanilla `xlsx` community i heq ne write.
 */

import * as XLSXStyle from 'xlsx-js-style';

const VAT_RATE = 0.2; // 🆕 TVSH 20% — konstante e Shqiperise.

// ── Style palette (perputhet me UG Report + Company Report) ────────────────
const COLOR_BRAND = '931623';
const COLOR_WHITE = 'FFFFFF';
const COLOR_TOTAL_ROW = 'FFF3CD';
const COLOR_INVOICE_BAND = 'E9F5D8';
const COLOR_INFO_BOX = 'FDECEA';
const COLOR_ZEBRA = 'F5F5F5';
const COLOR_SUBHEADER = 'DDEBF7';
// 🆕 Ngjyra shtese qe perputhen me foton e referencës se raportit FJORTES.
const COLOR_MARZHI_ORANGE = 'ED7D31';    // MARZHI BRUTO row (orange).
const COLOR_SECTION_YELLOW = 'FFF2CC';   // NDARJA FITIMIT / FATURIMI headers (light yellow band).

const STYLE_HEADER_CELL: any = {
    fill: { patternType: 'solid', fgColor: { rgb: COLOR_BRAND } },
    font: { bold: true, color: { rgb: COLOR_WHITE }, sz: 11 },
    alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
    border: {
        top: { style: 'thin', color: { rgb: '999999' } },
        bottom: { style: 'thin', color: { rgb: '999999' } },
        left: { style: 'thin', color: { rgb: '999999' } },
        right: { style: 'thin', color: { rgb: '999999' } },
    },
};

const STYLE_INVOICE_TITLE: any = {
    fill: { patternType: 'solid', fgColor: { rgb: COLOR_INVOICE_BAND } },
    font: { bold: true, sz: 12 },
    alignment: { horizontal: 'left', vertical: 'center' },
};

const STYLE_DATA_CELL: any = {
    font: { sz: 10 },
    alignment: { horizontal: 'left', vertical: 'center' },
    border: {
        top: { style: 'hair', color: { rgb: 'CCCCCC' } },
        bottom: { style: 'hair', color: { rgb: 'CCCCCC' } },
        left: { style: 'hair', color: { rgb: 'CCCCCC' } },
        right: { style: 'hair', color: { rgb: 'CCCCCC' } },
    },
};

const STYLE_DATA_CELL_BOLD: any = {
    font: { sz: 10, bold: true },
    alignment: { horizontal: 'left', vertical: 'center' },
    border: STYLE_DATA_CELL.border,
};

const STYLE_NUMBER_CELL: any = {
    font: { sz: 10 },
    alignment: { horizontal: 'right', vertical: 'center' },
    numFmt: '#,##0.00',
    border: STYLE_DATA_CELL.border,
};

const STYLE_NUMBER_CELL_BOLD: any = {
    font: { sz: 10, bold: true },
    alignment: { horizontal: 'right', vertical: 'center' },
    numFmt: '#,##0.00',
    border: STYLE_DATA_CELL.border,
};

const STYLE_SUBHEADER_ROW: any = {
    fill: { patternType: 'solid', fgColor: { rgb: COLOR_SUBHEADER } },
    font: { bold: true, sz: 10 },
    alignment: { horizontal: 'left', vertical: 'center' },
    border: STYLE_DATA_CELL.border,
};

// 🆕 TOTALI I SHITJEVE / KOSTO ENERGJI ELEKTRIKE — sfond jeshil (Vega) me tekst te bardhe bold.
const STYLE_TOTAL_ROW: any = {
    fill: { patternType: 'solid', fgColor: { rgb: COLOR_BRAND } },
    font: { bold: true, sz: 11, color: { rgb: COLOR_WHITE } },
    alignment: { horizontal: 'right', vertical: 'center' },
    numFmt: '#,##0.00',
    border: {
        top: { style: 'medium', color: { rgb: '666666' } },
        bottom: { style: 'medium', color: { rgb: '666666' } },
    },
};

const STYLE_TOTAL_LABEL: any = {
    ...STYLE_TOTAL_ROW,
    alignment: { horizontal: 'left', vertical: 'center' },
};

// 🆕 MARZHI BRUTO — sfond portokalli me tekst te bardhe bold.
const STYLE_MARZHI_ROW: any = {
    fill: { patternType: 'solid', fgColor: { rgb: COLOR_MARZHI_ORANGE } },
    font: { bold: true, sz: 12, color: { rgb: COLOR_WHITE } },
    alignment: { horizontal: 'right', vertical: 'center' },
    numFmt: '#,##0.00',
    border: {
        top: { style: 'medium', color: { rgb: '666666' } },
        bottom: { style: 'medium', color: { rgb: '666666' } },
    },
};

const STYLE_MARZHI_LABEL: any = {
    ...STYLE_MARZHI_ROW,
    alignment: { horizontal: 'left', vertical: 'center' },
};

// 🆕 Titull seksioni (FATURIMI MUJOR, INFORMACION PER PAGESE, ENERGJI ELEKTRIKE, etj).
const STYLE_SECTION_TITLE: any = {
    fill: { patternType: 'solid', fgColor: { rgb: COLOR_SECTION_YELLOW } },
    font: { bold: true, sz: 11 },
    alignment: { horizontal: 'left', vertical: 'center' },
};

// 🆕 Hyperlink style — teksti blu me underline, per te sinjalizuar qe qeliza eshte
// e klikueshme. Perdoret per CHARGER ne FATURE SHITJE qe cdo rresht te celi
// sheet-in perkates te chargerit.
const COLOR_HYPERLINK = '0563C1';
const STYLE_HYPERLINK_CELL: any = {
    font: { color: { rgb: COLOR_HYPERLINK }, underline: true, sz: 10 },
    alignment: { horizontal: 'left', vertical: 'center' },
    border: {
        top: { style: 'hair', color: { rgb: 'CCCCCC' } },
        bottom: { style: 'hair', color: { rgb: 'CCCCCC' } },
        left: { style: 'hair', color: { rgb: 'CCCCCC' } },
        right: { style: 'hair', color: { rgb: 'CCCCCC' } },
    },
};
const STYLE_HYPERLINK_CELL_BOLD: any = {
    ...STYLE_HYPERLINK_CELL,
    font: { color: { rgb: COLOR_HYPERLINK }, underline: true, sz: 10, bold: true },
};

// ── Utilities ──────────────────────────────────────────────────────────────

const num = (x: any): number => {
    if (x === null || x === undefined || x === '') return 0;
    const n = Number(x);
    return Number.isFinite(n) ? n : 0;
};

const sanitizeSheetName = (raw: string, maxLen: number = 31): string => {
    const cleaned = String(raw || 'Sheet')
        .replace(/[\[\]:\\\/\?\*]/g, '_')
        .replace(/\s+/g, ' ')
        .trim();
    return cleaned.substring(0, maxLen) || 'Sheet';
};

// Format periudhen per sheet name (kur eshte muaj i plote → `MM_YYYY`, ndryshe `YYYY-MM-DD_YYYY-MM-DD`).
const formatPeriodForSheetName = (from: string, to: string): string => {
    if (!from || !to) return 'period';
    const [fyStr, fmStr, fdStr] = from.split('-');
    const [tyStr, tmStr, tdStr] = to.split('-');
    const fy = parseInt(fyStr, 10);
    const fm = parseInt(fmStr, 10);
    const fd = parseInt(fdStr, 10);
    const ty = parseInt(tyStr, 10);
    const tm = parseInt(tmStr, 10);
    const td = parseInt(tdStr, 10);
    if (fy === ty && fm === tm && fd === 1) {
        const lastDayOfMonth = new Date(fy, fm, 0).getDate();
        if (td === lastDayOfMonth) return `${fmStr}_${fyStr}`;
    }
    return `${from}_${to}`;
};

const applyStyleToCell = (sheet: XLSXStyle.WorkSheet, addr: string, style: any) => {
    if (!sheet[addr]) sheet[addr] = { t: 's', v: '' };
    (sheet[addr] as any).s = style;
};

const applyStyleToRow = (sheet: XLSXStyle.WorkSheet, rowIdx: number, colStart: number, colEnd: number, style: any) => {
    for (let c = colStart; c <= colEnd; c++) {
        const addr = XLSXStyle.utils.encode_cell({ r: rowIdx, c });
        applyStyleToCell(sheet, addr, style);
    }
};

const setCell = (sheet: XLSXStyle.WorkSheet, addr: string, value: any, style?: any) => {
    const isNumber = typeof value === 'number' && Number.isFinite(value);
    sheet[addr] = { t: isNumber ? 'n' : 's', v: value };
    if (style) (sheet[addr] as any).s = style;
};

// 🆕 Cakton nje qelize numerike me FORMULE + vlere te llogaritur + stil.
// Excel do te shfaqe formulen ne bar-in e formulave dhe rezultatin ne qelize —
// perdoret per te ndihmuar verifikimin manual te llogaritjeve.
const setFormulaCell = (
    sheet: XLSXStyle.WorkSheet,
    r: number,
    c: number,
    formula: string,
    value: number,
    style?: any,
) => {
    const addr = XLSXStyle.utils.encode_cell({ r, c });
    sheet[addr] = { t: 'n', v: value, f: formula };
    if (style) (sheet[addr] as any).s = style;
};

// Shkronja e kolones nga indeksi 0-based (A=0, B=1, ...).
const XLCOL = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
// Excel row number (1-based) nga sheet row index (0-based).
const xlRow = (r: number) => r + 1;
// Referenca e qelizes: cellRef(3, 4) = "E4".
const cellRef = (r: number, c: number) => `${XLCOL[c]}${xlRow(r)}`;

// 🆕 Ndertim harte charger-name → sheet-name qe FATURE SHITJE hyperlinks te
// perputhen ekzaktesisht me emrat e sheet-eve per-charger (te njejta rregulla
// dedup + sanitize). Perdoret nga edhe FATURE SHITJE (link source) edhe
// buildPartnerReport* (krijimi i sheet-eve).
const buildChargerSheetNameMap = (reportMetadata: any[]): { chargerNames: string[]; sheetNameMap: Map<string, string> } => {
    const chargerNames = Array.from(new Set(
        (reportMetadata || [])
            .map((r: any) => r['Charge Point'])
            .filter((n: any) => n && n !== 'N/A')
    )).sort();

    const sheetNameMap = new Map<string, string>();
    const usedSheetNames = new Set<string>(['General']);
    for (const charger of chargerNames) {
        let sheetName = sanitizeSheetName(charger);
        let suffix = 2;
        while (usedSheetNames.has(sheetName)) {
            sheetName = sanitizeSheetName(`${charger}_${suffix++}`);
        }
        usedSheetNames.add(sheetName);
        sheetNameMap.set(charger, sheetName);
    }
    return { chargerNames, sheetNameMap };
};

// Kthen labelin e grupimit sipas rregullit te specifikuar.
export type Grouping = 'KLIENT/ KOMPANI' | 'VEGA STAFF' | 'KLIENT FUNDOR' | 'SHITJE ME KARTE CASH';

const GROUPINGS_ORDER: Grouping[] = [
    'KLIENT/ KOMPANI',
    'VEGA STAFF',
    'KLIENT FUNDOR',
    'SHITJE ME KARTE CASH',
];

const classifySession = (row: any, reportPartnerId: number | null): Grouping => {
    const hasUG = row.UserGroup && row.UserGroup !== 'N/A';
    if (!hasUG) return 'KLIENT FUNDOR';
    if (row['Is Vega Staff'] === true) return 'VEGA STAFF';
    const ugPid = row['UG Partner Id'];
    if (ugPid != null && reportPartnerId != null && Number(ugPid) === Number(reportPartnerId)) {
        return 'SHITJE ME KARTE CASH';
    }
    return 'KLIENT/ KOMPANI';
};

// ── Sheet builders ─────────────────────────────────────────────────────────

// 1) Sheet General — tabela e plote e sesioneve (i ngjashem me export-in aktual).
const buildGeneralSheet = (reportMetadata: any[]): XLSXStyle.WorkSheet => {
    // 🆕 Kolonat e reja Me TVSH / Pa TVSH:
    //   - Sale Rate + Sale Revenue: te dyja variantet (DB i mban me TVSH).
    //   - Purchase Rate + Purchase Cost: gjithnje pa TVSH (nga energy tariff).
    //   - Net Profit: pa TVSH (llogaritja e paster).
    //   - Partner/Company Earning: te dyja variantet (Pa TVSH nga margin, Me TVSH per faturim).
    const headers = [
        'Charging History ID', 'Charge Point', 'Location', 'Capacity', 'User', 'User Group',
        'RFID Serial No', 'Start Date', 'Start Time', 'End Time',
        'Duration (hh:mm:ss)', 'Energy (kWh)',
        'Sale Rate (Lek/kWh) Me TVSH', 'Sale Rate (Lek/kWh) Pa TVSH',
        'Sale Revenue (Lek) Me TVSH', 'Sale Revenue (Lek) Pa TVSH',
        'Purchase Rate (Lek/kWh) Pa TVSH', 'Purchase Cost (Lek) Pa TVSH',
        'Net Profit (Lek) Pa TVSH', 'Net Profit (Lek) Me TVSH',
        'Partner Share %', "Partner's Earning Pa TVSH", "Partner's Earning Me TVSH",
        'Company Share %', "Company's Earning Pa TVSH", "Company's Earning Me TVSH",
    ];

    // Ndihmes: nese backend s'ka fushat e reja (per rekorde legacy), llogariti nga vlerat me TVSH / mixed.
    const VAT = 0.2;
    const deriveExVAT = (r: any, keyIncVAT: string, keyExVAT: string): number => {
        const v = num(r[keyExVAT]);
        if (v !== 0) return v;
        return num(r[keyIncVAT]) / (1 + VAT);
    };

    const data = (reportMetadata || []).map((r: any) => {
        const partnerPct = num(r['Partner Share %']);
        const companyPct = num(r['Company Share %']) || (100 - partnerPct);
        const saleRateInc = num(r['Sale Rate (Lek/kWh)']);
        const saleRateEx = deriveExVAT(r, 'Sale Rate (Lek/kWh)', 'Sale Rate (Lek/kWh) Pa TVSH');
        const saleRevInc = num(r['Sale Revenue (Lek)']);
        const saleRevEx = deriveExVAT(r, 'Sale Revenue (Lek)', 'Sale Revenue (Lek) Pa TVSH');
        const purchaseRate = num(r['Purchase Rate (Lek/kWh)']);
        const purchaseCost = num(r['Purchase Cost (Lek)']);
        // Net profit pa TVSH: preferohet fusha e backend-it, perndryshe llogaritet.
        const netProfitEx = r['Net Profit (Lek) Pa TVSH'] !== undefined
            ? num(r['Net Profit (Lek) Pa TVSH'])
            : (saleRevEx - purchaseCost);
        // 🆕 Net Profit Me TVSH — preferohet fusha e backend-it, perndryshe llogaritet nga Pa TVSH × 1.2.
        const netProfitInc = r['Net Profit (Lek) Me TVSH'] !== undefined
            ? num(r['Net Profit (Lek) Me TVSH'])
            : (netProfitEx * (1 + VAT));
        const partnerEx = r["Partner's Earning Pa TVSH"] !== undefined
            ? num(r["Partner's Earning Pa TVSH"])
            : (netProfitEx * partnerPct / 100);
        const partnerInc = r["Partner's Earning Me TVSH"] !== undefined
            ? num(r["Partner's Earning Me TVSH"])
            : (partnerEx * (1 + VAT));
        const companyEx = r["Company's Earning Pa TVSH"] !== undefined
            ? num(r["Company's Earning Pa TVSH"])
            : (netProfitEx - partnerEx);
        const companyInc = r["Company's Earning Me TVSH"] !== undefined
            ? num(r["Company's Earning Me TVSH"])
            : (companyEx * (1 + VAT));

        return [
            num(r['Charging History ID']) || '',
            r['Charge Point'] || '',
            r['Location'] || '',
            r['Capacity'] || '',
            r['User'] || '',
            r['UserGroup'] || '',
            (!r['RFID Serial No'] || String(r['RFID Serial No']).trim().toLowerCase() === 'unknown')
                ? 'Remote Start' : r['RFID Serial No'],
            r['Start Date'] || '',
            r['Start Time'] || '',
            r['End Time'] || '',
            r['formattedDuration'] || r['Duration (min)'] || '',
            num(r['Energy (kWh)']),
            saleRateInc,
            saleRateEx,
            saleRevInc,
            saleRevEx,
            purchaseRate,
            purchaseCost,
            netProfitEx,
            netProfitInc,
            partnerPct,
            partnerEx,
            partnerInc,
            companyPct,
            companyEx,
            companyInc,
        ];
    });

    const sheet = XLSXStyle.utils.aoa_to_sheet([headers, ...data]);
    // Style header.
    for (let c = 0; c < headers.length; c++) {
        applyStyleToCell(sheet, XLSXStyle.utils.encode_cell({ r: 0, c }), STYLE_HEADER_CELL);
    }
    // Style number cells (kolonat numerike fillojne pas 'Duration (hh:mm:ss)').
    // Ndryshuar nga 10 → 11 pas shtimit te "Location" ngjit me "Charge Point".
    for (let r = 1; r <= data.length; r++) {
        for (let c = 11; c < headers.length; c++) {
            applyStyleToCell(sheet, XLSXStyle.utils.encode_cell({ r, c }), STYLE_NUMBER_CELL);
        }
    }
    sheet['!cols'] = headers.map((h) => ({ wch: Math.min(24, Math.max(12, h.length + 2)) }));
    sheet['!freeze'] = { ySplit: 1 } as any;
    return sheet;
};

// 2) Sheet FATURE SHITJE — permbledhja e komplete e fatures.
//
// KONVENTA E TVSH-se (e rendesishme):
//   - `Sale Rate (Lek/kWh)` ne DB permban CMIMIN E SHITJES ME TVSH (p.sh. 40 Lek).
//   - `Sale Revenue (Lek)` = total_cost ne DB = VLERE ME TVSH (p.sh. kwh × 40).
//   - Ne sheet ne shfaqim CMIMIN PA TVSH: `çmim shitje = saleRate / 1.2`.
//   - `Vlere pa TVSH` = saleRevenue / 1.2 ; `TVSH 20%` = pa_tvsh × 0.2 ; `Vlere me TVSH` = saleRevenue.
//   - Grupimi per rreshta te tabeles behet mbi cmimin ORIGJINAL (me TVSH) qe rreshtat me te
//     njejtin cmim historik te bashkohen; ne display shfaqim priceExVAT.
const buildFatureShitjeSheet = (
    reportMetadata: any[],
    partnerName: string,
    reportPartnerId: number | null,
    partnerSplitPct: number,
    from: string,
    to: string,
    // 🆕 Harte charger-name → sheet-name qe rreshtat e tabeles kryesore te kene
    // hyperlink per tek sheet-i perkates i chargerit.
    chargerSheetMap: Map<string, string>,
    // 🆕 Burimi i faturimit te energjise ('OSHEE' | 'PARTNER' | 'INDIPENDENT').
    // Kur = 'OSHEE': partneri s'e fature energjine, ndaj rreshti ENERGJI ELEKTRIKE
    // ne "FATURIM PARTNER NDAJ VEGA CHARGING" hiqet dhe VLERA FATURIMIT = vetem
    // PARTNER FEE. Per te tjeret, mbetet si me pare.
    energyInvoicingSource: string | null = 'OSHEE',
): XLSXStyle.WorkSheet => {
    // 🆕 OSHEE = Partneri nuk fature energjine (OSHEE i faturon direkt Vega Charging).
    const isOSHEE = String(energyInvoicingSource || 'OSHEE').toUpperCase() === 'OSHEE';
    const period = formatPeriodForSheetName(from, to);
    const invoiceTitle = `FATURE SHITJE_${period}`;

    // ── 1. Grupim per (Charger × Grouping × Sale Price) ──
    const rowMap = new Map<string, {
        charger: string;
        grouping: Grouping;
        salePriceRaw: number;   // Cmimi origjinal (me TVSH) — çelesi i grupimit.
        salePriceExVAT: number; // Cmimi qe shfaqet (pa TVSH).
        kwh: number;
        saleRevenue: number;    // Total me TVSH (nga DB).
    }>();
    // Track cka mund te jete i njejti (charger × grouping) me disa cmime — per bold.
    const chargerGroupPriceCount = new Map<string, Set<number>>();

    for (const row of (reportMetadata || [])) {
        const kwh = num(row['Energy (kWh)']);
        if (kwh <= 0) continue;
        const charger = row['Charge Point'] || 'N/A';
        const grouping = classifySession(row, reportPartnerId);
        // Sale rate ne DB eshte ME TVSH. E kthejme ne PA TVSH per display.
        const salePriceRaw = Number(num(row['Sale Rate (Lek/kWh)']).toFixed(2));
        const salePriceExVAT = Number((salePriceRaw / (1 + VAT_RATE)).toFixed(2));
        const saleRevenue = num(row['Sale Revenue (Lek)']);

        const key = `${charger}||${grouping}||${salePriceRaw}`;
        const existing = rowMap.get(key);
        if (existing) {
            existing.kwh += kwh;
            existing.saleRevenue += saleRevenue;
        } else {
            rowMap.set(key, { charger, grouping, salePriceRaw, salePriceExVAT, kwh, saleRevenue });
        }
        const cgKey = `${charger}||${grouping}`;
        if (!chargerGroupPriceCount.has(cgKey)) chargerGroupPriceCount.set(cgKey, new Set());
        chargerGroupPriceCount.get(cgKey)!.add(salePriceRaw);
    }

    // Rendit rreshtat: nga charger asc, pastaj grouping sipas GROUPINGS_ORDER, pastaj salePriceRaw asc.
    const groupOrder: Record<string, number> = GROUPINGS_ORDER.reduce((acc, g, i) => {
        acc[g] = i;
        return acc;
    }, {} as Record<string, number>);
    const rows = Array.from(rowMap.values()).sort((a, b) => {
        const c = a.charger.localeCompare(b.charger);
        if (c !== 0) return c;
        const g = (groupOrder[a.grouping] ?? 99) - (groupOrder[b.grouping] ?? 99);
        if (g !== 0) return g;
        return a.salePriceRaw - b.salePriceRaw;
    });

    // ── 2. Aggregate per grouping (kolonat 2 & 3 poshte tabeles) ──
    // Per çdo grouping × cmim (me TVSH si çeles) → { kwh, saleRevenue, priceExVAT }.
    const perGroupPrice: Record<Grouping, Map<number, { kwh: number; saleRevenue: number; priceExVAT: number }>> = {
        'KLIENT/ KOMPANI': new Map(),
        'VEGA STAFF': new Map(),
        'KLIENT FUNDOR': new Map(),
        'SHITJE ME KARTE CASH': new Map(),
    };
    for (const r of rows) {
        const pmap = perGroupPrice[r.grouping];
        const existing = pmap.get(r.salePriceRaw);
        if (existing) {
            existing.kwh += r.kwh;
            existing.saleRevenue += r.saleRevenue;
        } else {
            pmap.set(r.salePriceRaw, { kwh: r.kwh, saleRevenue: r.saleRevenue, priceExVAT: r.salePriceExVAT });
        }
    }

    // ── 3. Aggregate per purchase rate (KOSTO ENERGJI ELEKTRIKE) ──
    // Cdo purchase rate unik → linje me kwh totale.
    const purchaseRateMap = new Map<number, number>();
    for (const row of (reportMetadata || [])) {
        const kwh = num(row['Energy (kWh)']);
        if (kwh <= 0) continue;
        const rate = Number(num(row['Purchase Rate (Lek/kWh)']).toFixed(4));
        purchaseRateMap.set(rate, (purchaseRateMap.get(rate) || 0) + kwh);
    }
    const purchaseRates = Array.from(purchaseRateMap.entries())
        .sort((a, b) => b[1] - a[1]); // Renditur nga kwh me shume (kontraten kryesore lart).

    // ── 4. Totals ──
    // saleRevenue eshte ME TVSH (nga DB). E kthejme ne pa-TVSH duke pjesetuar me 1.2.
    const totalKwhSale = rows.reduce((acc, r) => acc + r.kwh, 0);
    const totalSaleIncVAT = rows.reduce((acc, r) => acc + r.saleRevenue, 0);
    const totalSaleExVAT = totalSaleIncVAT / (1 + VAT_RATE);
    const totalVAT = totalSaleIncVAT - totalSaleExVAT;

    const totalPurchaseKwh = purchaseRates.reduce((acc, [, kwh]) => acc + kwh, 0);
    const totalPurchaseCostExVAT = purchaseRates.reduce((acc, [rate, kwh]) => acc + rate * kwh, 0);
    const totalPurchaseVAT = totalPurchaseCostExVAT * VAT_RATE;
    const totalPurchaseIncVAT = totalPurchaseCostExVAT + totalPurchaseVAT;

    const marziBruto = totalSaleExVAT - totalPurchaseCostExVAT;
    const partnerPct = Number.isFinite(Number(partnerSplitPct)) ? Number(partnerSplitPct) : 50;
    const vegaPct = 100 - partnerPct;
    const partnerEarning = marziBruto * (partnerPct / 100);
    const vegaEarning = marziBruto * (vegaPct / 100);

    // ── Ndertimi i sheet-it ──
    // Kolonat: A=#, B=CHARGER, C=REZULTATI I PIKES SIPAS KLIENTEVE, D=kWh, E=cmim shitje (pa TVSH),
    // F=Vlere pa TVSH, G=TVSH 20%, H=Vlere me TVSH.
    const aoa: any[][] = [];
    // Header lines.
    aoa.push(['', 'PERIUDHE FATURIMI:', invoiceTitle, '', '', '', '', '', '']);
    aoa.push(['', 'Periudha:', `${from} → ${to}`, '', '', '', '', '', '']);
    aoa.push(['', '', '', '', '', '', '', 'LEKE', '']);
    // Header kolonash.
    aoa.push(['', 'CHARGER', 'REZULTATI I PIKES SIPAS KLIENTEVE', 'kWh', 'çmim shitje pa TVSH', 'Vlere pa TVSH', 'TVSH 20%', 'Vlere me TVSH', '']);
    const HEADER_ROW_IDX = aoa.length - 1;

    // Rreshtat kryesore te tabeles.
    let seqNum = 1;
    const boldRowIndices: number[] = [];
    for (const r of rows) {
        const vleraMeTvsh = r.saleRevenue;
        const vleraPaTvsh = vleraMeTvsh / (1 + VAT_RATE);
        const tvsh = vleraMeTvsh - vleraPaTvsh;

        const cgKey = `${r.charger}||${r.grouping}`;
        const isBold = (chargerGroupPriceCount.get(cgKey)?.size || 0) > 1;
        if (isBold) boldRowIndices.push(aoa.length);

        aoa.push([
            seqNum++,
            r.charger,
            r.grouping,
            Number(r.kwh.toFixed(2)),
            Number(r.salePriceExVAT.toFixed(2)),
            Number(vleraPaTvsh.toFixed(2)),
            Number(tvsh.toFixed(2)),
            Number(vleraMeTvsh.toFixed(2)),
            '',
        ]);
    }
    // Empty row.
    aoa.push(['', '', '', '', '', '', '', '', '']);
    // TOTALI I SHITJEVE.
    aoa.push(['', '', 'TOTALI I SHITJEVE', Number(totalKwhSale.toFixed(2)), '', Number(totalSaleExVAT.toFixed(2)), Number(totalVAT.toFixed(2)), Number(totalSaleIncVAT.toFixed(2)), '']);
    const TOTAL_SALE_ROW_IDX = aoa.length - 1;
    aoa.push(['', '', '', '', '', '', '', '', '']);

    // KONSUMI SIPAS PIKAVE — header.
    aoa.push(['', '', `KONSUMI SIPAS PIKAVE ${partnerName.toUpperCase()}`, 'kWh', 'çmim shitje pa TVSH', 'Vlere pa TVSH', 'TVSH 20%', 'Vlere me TVSH', '']);
    const KONSUMI_HEADER_ROW_IDX = aoa.length - 1;
    // 🆕 Track cilat rreshta te KONSUMI-t jane SHITJE ME KARTE CASH — perdoret me poshte
    // nga FATURIM VEGA → SHERBIM KARIKIMI qe te reference (SUM) direkt keto rreshta.
    const kartCashKonsumiRowIdxs: number[] = [];
    let seqK = 1;
    for (const g of GROUPINGS_ORDER) {
        const pmap = perGroupPrice[g];
        if (pmap.size === 0) continue;
        const entries = Array.from(pmap.entries()).sort((a, b) => a[0] - b[0]);
        for (const [, agg] of entries) {
            const vleraMeTvsh = agg.saleRevenue;
            const vleraPaTvsh = vleraMeTvsh / (1 + VAT_RATE);
            const tvsh = vleraMeTvsh - vleraPaTvsh;
            aoa.push([
                seqK++, '', g,
                Number(agg.kwh.toFixed(2)),
                Number(agg.priceExVAT.toFixed(2)),
                Number(vleraPaTvsh.toFixed(2)),
                Number(tvsh.toFixed(2)),
                Number(vleraMeTvsh.toFixed(2)),
                '',
            ]);
            if (g === 'SHITJE ME KARTE CASH') {
                kartCashKonsumiRowIdxs.push(aoa.length - 1);
            }
        }
    }
    // Totali sales (perseritur).
    aoa.push(['', '', 'TOTALI I SHITJEVE', Number(totalKwhSale.toFixed(2)), '', Number(totalSaleExVAT.toFixed(2)), Number(totalVAT.toFixed(2)), Number(totalSaleIncVAT.toFixed(2)), '']);
    const KONSUMI_TOTAL_ROW_IDX = aoa.length - 1;

    aoa.push(['', '', '', '', '', '', '', '', '']);
    // ENERGJI ELEKTRIKE section — mbetet gjithmone (nevojitet per MARZHI BRUTO).
    // Ne rastin OSHEE, heqja behet VETEM ne seksionin "FATURIM PARTNER NDAJ VEGA".
    aoa.push(['', '', 'ENERGJI ELEKTRIKE', '', '', '', '', '', '']);
    const ENERGY_HEADER_ROW_IDX = aoa.length - 1;
    let seqE = 1;
    for (const [rate, kwh] of purchaseRates) {
        const vleraPaTvsh = rate * kwh;
        const tvsh = vleraPaTvsh * VAT_RATE;
        const vleraMeTvsh = vleraPaTvsh + tvsh;
        aoa.push([
            seqE++, '',
            `ENERGJI ELEKTRIKE ( KONTRATA ${partnerName.toUpperCase()})`,
            Number(kwh.toFixed(2)),
            Number(rate.toFixed(2)),
            Number(vleraPaTvsh.toFixed(2)),
            Number(tvsh.toFixed(2)),
            Number(vleraMeTvsh.toFixed(2)),
            '',
        ]);
    }
    aoa.push(['', '', 'KOSTO ENERGJI ELEKTRIKE', Number(totalPurchaseKwh.toFixed(2)), '', Number(totalPurchaseCostExVAT.toFixed(2)), Number(totalPurchaseVAT.toFixed(2)), Number(totalPurchaseIncVAT.toFixed(2)), '']);
    const KOSTO_TOTAL_ROW_IDX = aoa.length - 1;

    aoa.push(['', '', '', '', '', '', '', '', '']);
    aoa.push(['', '', '', '', '', '', '', '', '']);
    aoa.push(['', '', 'MARZHI BRUTO', '', '', Number(marziBruto.toFixed(2)), '', '', '']);
    const MARZHI_ROW_IDX = aoa.length - 1;

    aoa.push(['', '', '', '', '', '', '', '', '']);
    aoa.push(['', '', '', '', '', '', '', '', '']);
    aoa.push(['', '', 'NDARJA FITIMIT SIPAS MARREVESHJES', '', '', 'Vlere pa TVSH', '', '', '']);
    const NDARJA_HEADER_ROW_IDX = aoa.length - 1;
    aoa.push([1, '', 'VEGA CHARGING', '', Number((vegaPct / 100).toFixed(2)), Number(vegaEarning.toFixed(2)), '', '', '']);
    const NDARJA_VEGA_ROW_IDX = aoa.length - 1;
    aoa.push([2, '', `${partnerName.toUpperCase()} ${partnerPct} % FEE`, '', Number((partnerPct / 100).toFixed(2)), Number(partnerEarning.toFixed(2)), '', '', '']);
    const NDARJA_PARTNER_ROW_IDX = aoa.length - 1;

    aoa.push(['', '', '', '', '', '', '', '', '']);
    aoa.push(['', '', 'FATURIMI MUJOR', '', '', '', '', '', '']);
    const FATURIMI_MUJOR_TITLE_ROW_IDX = aoa.length - 1;

    aoa.push(['', '', '', '', '', '', '', '', '']);
    aoa.push(['', '', `FATURIM ${partnerName.toUpperCase()} SHPK NDAJ VEGA CHARGING`, 'kWh', 'çmim blerje', 'Vlere pa TVSH', 'TVSH 20%', 'Vlere me TVSH', '']);
    const FAT_PARTNER_HEADER_ROW_IDX = aoa.length - 1;
    // 🆕 Kur partner.energy_invoicing_source = 'OSHEE', partneri s'e fature energjine
    // (OSHEE i shet direkt Vega Charging), keshtu qe rreshti ENERGJI ELEKTRIKE hiqet.
    let FAT_PARTNER_ENERGY_ROW_IDX = -1;
    if (!isOSHEE) {
        aoa.push(['', '', 'ENERGJI ELEKTRIKE', Number(totalPurchaseKwh.toFixed(2)),
            purchaseRates.length === 1 ? Number(purchaseRates[0][0].toFixed(2)) : '',
            Number(totalPurchaseCostExVAT.toFixed(2)), Number(totalPurchaseVAT.toFixed(2)), Number(totalPurchaseIncVAT.toFixed(2)), '']);
        FAT_PARTNER_ENERGY_ROW_IDX = aoa.length - 1;
    }
    aoa.push(['', '', `${partnerName.toUpperCase()} SHPK  ${partnerPct}% FEE`, '', '', Number(partnerEarning.toFixed(2)), Number((partnerEarning * VAT_RATE).toFixed(2)), Number((partnerEarning * (1 + VAT_RATE)).toFixed(2)), '']);
    const FAT_PARTNER_FEE_ROW_IDX = aoa.length - 1;
    // 🆕 VLERA FATURIMIT: kur OSHEE, vetem PARTNER FEE (pa energji). Perndryshe, ENERGJI + FEE.
    const invoicePartnerExVAT = isOSHEE ? partnerEarning : (totalPurchaseCostExVAT + partnerEarning);
    const invoicePartnerVAT = invoicePartnerExVAT * VAT_RATE;
    const invoicePartnerIncVAT = invoicePartnerExVAT + invoicePartnerVAT;
    aoa.push(['', '', 'VLERA FATURIMIT', '', '', Number(invoicePartnerExVAT.toFixed(2)), Number(invoicePartnerVAT.toFixed(2)), Number(invoicePartnerIncVAT.toFixed(2)), '']);
    const INV_PARTNER_ROW_IDX = aoa.length - 1;

    aoa.push(['', '', '', '', '', '', '', '', '']);
    aoa.push(['', '', `FATURIM VEGA CHARGING NDAJ ${partnerName.toUpperCase()} SHPK`, 'kWh', 'çmim shitje pa TVSH', 'Vlere pa TVSH', 'TVSH 20%', 'Vlere me TVSH', '']);
    const FAT_VEGA_HEADER_ROW_IDX = aoa.length - 1;
    // Sherbim karikimi = totali SHITJE ME KARTE CASH (partnerat qe blejne shitjen).
    const kartCash = perGroupPrice['SHITJE ME KARTE CASH'];
    const kartCashKwh = Array.from(kartCash.values()).reduce((acc, v) => acc + v.kwh, 0);
    const kartCashRevIncVAT = Array.from(kartCash.values()).reduce((acc, v) => acc + v.saleRevenue, 0);
    const kartCashRevExVAT = kartCashRevIncVAT / (1 + VAT_RATE);
    const kartCashVAT = kartCashRevIncVAT - kartCashRevExVAT;
    const kartCashAvgRateExVAT = kartCashKwh > 0 ? kartCashRevExVAT / kartCashKwh : 0;
    aoa.push(['', '', 'SHERBIM KARIKIMI',
        Number(kartCashKwh.toFixed(2)),
        Number(kartCashAvgRateExVAT.toFixed(2)),
        Number(kartCashRevExVAT.toFixed(2)),
        Number(kartCashVAT.toFixed(2)),
        Number(kartCashRevIncVAT.toFixed(2)),
        '',
    ]);
    const FAT_VEGA_SERVICE_ROW_IDX = aoa.length - 1;
    aoa.push(['', '', 'VLERA FATURIMIT', '', '',
        Number(kartCashRevExVAT.toFixed(2)),
        Number(kartCashVAT.toFixed(2)),
        Number(kartCashRevIncVAT.toFixed(2)),
        '']);
    const INV_VEGA_ROW_IDX = aoa.length - 1;

    aoa.push(['', '', '', '', '', '', '', '', '']);
    aoa.push(['', '', 'FITIMI NETO', '', '', Number(partnerEarning.toFixed(2)), '', '', '']);
    const FITIMI_NETO_ROW_IDX = aoa.length - 1;

    aoa.push(['', '', '', '', '', '', '', '', '']);
    aoa.push(['', '', 'INFORMACION PER PAGESE', '', '', '', '', '', '']);
    const INFO_PAGESE_TITLE_ROW_IDX = aoa.length - 1;
    aoa.push(['', '', '', '', '', '', '', '', '']);
    aoa.push(['', '', `DETYRIM ${partnerName.toUpperCase()} SHPK NDAJ VEGA CHARGING`, '', '', '', '', 'VLERA', '']);
    const DET_PARTNER_TITLE_ROW_IDX = aoa.length - 1;
    aoa.push(['', '', 'DETYRIM I MBARTUR', '', '', '', '', '', '']);
    aoa.push(['', '', 'DETYRIMI AKTUAL', '', '', '', '', Number(invoicePartnerIncVAT.toFixed(2)), '']);
    const DET_PARTNER_AKTUAL_ROW_IDX = aoa.length - 1;
    aoa.push(['', '', '', '', '', '', '', '', '']);
    aoa.push(['', '', `DETYRIM VEGA CHARGING NDAJ ${partnerName.toUpperCase()} SHPK`, '', '', '', '', 'VLERA', '']);
    const DET_VEGA_TITLE_ROW_IDX = aoa.length - 1;
    aoa.push(['', '', 'DETYRIM I MBARTUR', '', '', '', '', '', '']);
    aoa.push(['', '', 'DETYRIMI AKTUAL', '', '', '', '', Number(kartCashRevIncVAT.toFixed(2)), '']);
    const DET_VEGA_AKTUAL_ROW_IDX = aoa.length - 1;
    // 🆕 Rreshti NETIM u hoq — nuk sherbente per procesin e faturimit dhe krijonte konfuzion.

    // Krijo sheet-in.
    const sheet = XLSXStyle.utils.aoa_to_sheet(aoa);

    // Kolonat: A=#(0), B=CHARGER(1), C=REZULTATI(2), D=kWh(3), E=cmim shitje(4),
    //          F=Vlere pa TVSH(5), G=TVSH 20%(6), H=Vlere me TVSH(7).
    const LAST_COL = 7;
    const NUM_START = 3; // Kolonat me numra fillojne nga D (indeks 3).
    const COL_KWH = 3, COL_PRICE = 4, COL_PA_TVSH = 5, COL_TVSH = 6, COL_ME_TVSH = 7;

    // ── FORMULA POST-PROCESSING ─────────────────────────────────────────────
    // Perdorim setFormulaCell qe Excel te shfaqe formulen ne bar-in e formulave —
    // ndihmon perdoruesin te verifikoje llogaritjet duke klikuar mbi qelize.

    // MAIN TABLE — çdo rresht: F = D*E, G = F*0.2, H = F+G.
    const MAIN_DATA_FIRST_ROW = HEADER_ROW_IDX + 1;
    const MAIN_DATA_LAST_ROW = HEADER_ROW_IDX + rows.length; // 0-based inclusive.
    for (let r = MAIN_DATA_FIRST_ROW; r <= MAIN_DATA_LAST_ROW; r++) {
        const kwh = num(sheet[cellRef(r, COL_KWH)]?.v);
        const price = num(sheet[cellRef(r, COL_PRICE)]?.v);
        const paTvsh = kwh * price;
        const tvsh = paTvsh * VAT_RATE;
        setFormulaCell(sheet, r, COL_PA_TVSH,
            `${cellRef(r, COL_KWH)}*${cellRef(r, COL_PRICE)}`, paTvsh);
        setFormulaCell(sheet, r, COL_TVSH,
            `${cellRef(r, COL_PA_TVSH)}*${VAT_RATE}`, tvsh);
        setFormulaCell(sheet, r, COL_ME_TVSH,
            `${cellRef(r, COL_PA_TVSH)}+${cellRef(r, COL_TVSH)}`, paTvsh + tvsh);
    }
    // TOTALI I SHITJEVE — SUM mbi rreshtat e tabeles.
    if (rows.length > 0) {
        const rangeKwh = `${cellRef(MAIN_DATA_FIRST_ROW, COL_KWH)}:${cellRef(MAIN_DATA_LAST_ROW, COL_KWH)}`;
        const rangePa = `${cellRef(MAIN_DATA_FIRST_ROW, COL_PA_TVSH)}:${cellRef(MAIN_DATA_LAST_ROW, COL_PA_TVSH)}`;
        const rangeTvsh = `${cellRef(MAIN_DATA_FIRST_ROW, COL_TVSH)}:${cellRef(MAIN_DATA_LAST_ROW, COL_TVSH)}`;
        const rangeMe = `${cellRef(MAIN_DATA_FIRST_ROW, COL_ME_TVSH)}:${cellRef(MAIN_DATA_LAST_ROW, COL_ME_TVSH)}`;
        setFormulaCell(sheet, TOTAL_SALE_ROW_IDX, COL_KWH, `SUM(${rangeKwh})`, totalKwhSale);
        setFormulaCell(sheet, TOTAL_SALE_ROW_IDX, COL_PA_TVSH, `SUM(${rangePa})`, totalSaleExVAT);
        setFormulaCell(sheet, TOTAL_SALE_ROW_IDX, COL_TVSH, `SUM(${rangeTvsh})`, totalVAT);
        setFormulaCell(sheet, TOTAL_SALE_ROW_IDX, COL_ME_TVSH, `SUM(${rangeMe})`, totalSaleIncVAT);
    }

    // KONSUMI SIPAS PIKAVE — data rows F/G/H formula (D*E, F*0.2, F+G).
    // Data rows fillojne nga KONSUMI_HEADER_ROW_IDX + 1 deri KONSUMI_TOTAL_ROW_IDX - 1.
    const KONSUMI_FIRST = KONSUMI_HEADER_ROW_IDX + 1;
    const KONSUMI_LAST = KONSUMI_TOTAL_ROW_IDX - 1;
    for (let r = KONSUMI_FIRST; r <= KONSUMI_LAST; r++) {
        const kwh = num(sheet[cellRef(r, COL_KWH)]?.v);
        const price = num(sheet[cellRef(r, COL_PRICE)]?.v);
        if (!kwh && !price) continue;
        const paTvsh = kwh * price;
        setFormulaCell(sheet, r, COL_PA_TVSH,
            `${cellRef(r, COL_KWH)}*${cellRef(r, COL_PRICE)}`, paTvsh);
        setFormulaCell(sheet, r, COL_TVSH,
            `${cellRef(r, COL_PA_TVSH)}*${VAT_RATE}`, paTvsh * VAT_RATE);
        setFormulaCell(sheet, r, COL_ME_TVSH,
            `${cellRef(r, COL_PA_TVSH)}+${cellRef(r, COL_TVSH)}`, paTvsh + paTvsh * VAT_RATE);
    }
    if (KONSUMI_LAST >= KONSUMI_FIRST) {
        const rangeKwh = `${cellRef(KONSUMI_FIRST, COL_KWH)}:${cellRef(KONSUMI_LAST, COL_KWH)}`;
        const rangePa = `${cellRef(KONSUMI_FIRST, COL_PA_TVSH)}:${cellRef(KONSUMI_LAST, COL_PA_TVSH)}`;
        const rangeTvsh = `${cellRef(KONSUMI_FIRST, COL_TVSH)}:${cellRef(KONSUMI_LAST, COL_TVSH)}`;
        const rangeMe = `${cellRef(KONSUMI_FIRST, COL_ME_TVSH)}:${cellRef(KONSUMI_LAST, COL_ME_TVSH)}`;
        setFormulaCell(sheet, KONSUMI_TOTAL_ROW_IDX, COL_KWH, `SUM(${rangeKwh})`, totalKwhSale);
        setFormulaCell(sheet, KONSUMI_TOTAL_ROW_IDX, COL_PA_TVSH, `SUM(${rangePa})`, totalSaleExVAT);
        setFormulaCell(sheet, KONSUMI_TOTAL_ROW_IDX, COL_TVSH, `SUM(${rangeTvsh})`, totalVAT);
        setFormulaCell(sheet, KONSUMI_TOTAL_ROW_IDX, COL_ME_TVSH, `SUM(${rangeMe})`, totalSaleIncVAT);
    }

    // ENERGJI ELEKTRIKE — çdo rresht: F = D*E, G = F*0.2, H = F+G.
    const ENERGY_FIRST = ENERGY_HEADER_ROW_IDX + 1;
    const ENERGY_LAST = KOSTO_TOTAL_ROW_IDX - 1;
    for (let r = ENERGY_FIRST; r <= ENERGY_LAST; r++) {
        const kwh = num(sheet[cellRef(r, COL_KWH)]?.v);
        const rate = num(sheet[cellRef(r, COL_PRICE)]?.v);
        if (!kwh && !rate) continue;
        const paTvsh = kwh * rate;
        setFormulaCell(sheet, r, COL_PA_TVSH,
            `${cellRef(r, COL_KWH)}*${cellRef(r, COL_PRICE)}`, paTvsh);
        setFormulaCell(sheet, r, COL_TVSH,
            `${cellRef(r, COL_PA_TVSH)}*${VAT_RATE}`, paTvsh * VAT_RATE);
        setFormulaCell(sheet, r, COL_ME_TVSH,
            `${cellRef(r, COL_PA_TVSH)}+${cellRef(r, COL_TVSH)}`, paTvsh + paTvsh * VAT_RATE);
    }
    // KOSTO ENERGJI TOTAL — SUM.
    if (ENERGY_LAST >= ENERGY_FIRST) {
        const rangeKwh = `${cellRef(ENERGY_FIRST, COL_KWH)}:${cellRef(ENERGY_LAST, COL_KWH)}`;
        const rangePa = `${cellRef(ENERGY_FIRST, COL_PA_TVSH)}:${cellRef(ENERGY_LAST, COL_PA_TVSH)}`;
        const rangeTvsh = `${cellRef(ENERGY_FIRST, COL_TVSH)}:${cellRef(ENERGY_LAST, COL_TVSH)}`;
        const rangeMe = `${cellRef(ENERGY_FIRST, COL_ME_TVSH)}:${cellRef(ENERGY_LAST, COL_ME_TVSH)}`;
        setFormulaCell(sheet, KOSTO_TOTAL_ROW_IDX, COL_KWH, `SUM(${rangeKwh})`, totalPurchaseKwh);
        setFormulaCell(sheet, KOSTO_TOTAL_ROW_IDX, COL_PA_TVSH, `SUM(${rangePa})`, totalPurchaseCostExVAT);
        setFormulaCell(sheet, KOSTO_TOTAL_ROW_IDX, COL_TVSH, `SUM(${rangeTvsh})`, totalPurchaseVAT);
        setFormulaCell(sheet, KOSTO_TOTAL_ROW_IDX, COL_ME_TVSH, `SUM(${rangeMe})`, totalPurchaseIncVAT);
    }

    // MARZHI BRUTO = TOTALI SHITJEVE (Vlere pa TVSH) − KOSTO ENERGJI (Vlere pa TVSH).
    setFormulaCell(sheet, MARZHI_ROW_IDX, COL_PA_TVSH,
        `${cellRef(TOTAL_SALE_ROW_IDX, COL_PA_TVSH)}-${cellRef(KOSTO_TOTAL_ROW_IDX, COL_PA_TVSH)}`,
        marziBruto);

    // NDARJA FITIMIT — VEGA = MARZHI * vega%, PARTNER = MARZHI * partner%.
    setFormulaCell(sheet, NDARJA_VEGA_ROW_IDX, COL_PA_TVSH,
        `${cellRef(MARZHI_ROW_IDX, COL_PA_TVSH)}*${cellRef(NDARJA_VEGA_ROW_IDX, COL_PRICE)}`,
        vegaEarning);
    setFormulaCell(sheet, NDARJA_PARTNER_ROW_IDX, COL_PA_TVSH,
        `${cellRef(MARZHI_ROW_IDX, COL_PA_TVSH)}*${cellRef(NDARJA_PARTNER_ROW_IDX, COL_PRICE)}`,
        partnerEarning);

    // FATURIM PARTNER NDAJ VEGA:
    //   ENERGJI ELEKTRIKE row: vetem nese energy_invoicing_source != 'OSHEE'.
    if (FAT_PARTNER_ENERGY_ROW_IDX >= 0) {
        setFormulaCell(sheet, FAT_PARTNER_ENERGY_ROW_IDX, COL_KWH,
            cellRef(KOSTO_TOTAL_ROW_IDX, COL_KWH), totalPurchaseKwh);
        setFormulaCell(sheet, FAT_PARTNER_ENERGY_ROW_IDX, COL_PA_TVSH,
            cellRef(KOSTO_TOTAL_ROW_IDX, COL_PA_TVSH), totalPurchaseCostExVAT);
        setFormulaCell(sheet, FAT_PARTNER_ENERGY_ROW_IDX, COL_TVSH,
            cellRef(KOSTO_TOTAL_ROW_IDX, COL_TVSH), totalPurchaseVAT);
        setFormulaCell(sheet, FAT_PARTNER_ENERGY_ROW_IDX, COL_ME_TVSH,
            cellRef(KOSTO_TOTAL_ROW_IDX, COL_ME_TVSH), totalPurchaseIncVAT);
    }
    //   PARTNER FEE row: reference NDARJA PARTNER (Vlere pa TVSH) + tvsh + me tvsh.
    setFormulaCell(sheet, FAT_PARTNER_FEE_ROW_IDX, COL_PA_TVSH,
        cellRef(NDARJA_PARTNER_ROW_IDX, COL_PA_TVSH), partnerEarning);
    setFormulaCell(sheet, FAT_PARTNER_FEE_ROW_IDX, COL_TVSH,
        `${cellRef(FAT_PARTNER_FEE_ROW_IDX, COL_PA_TVSH)}*${VAT_RATE}`, partnerEarning * VAT_RATE);
    setFormulaCell(sheet, FAT_PARTNER_FEE_ROW_IDX, COL_ME_TVSH,
        `${cellRef(FAT_PARTNER_FEE_ROW_IDX, COL_PA_TVSH)}+${cellRef(FAT_PARTNER_FEE_ROW_IDX, COL_TVSH)}`,
        partnerEarning * (1 + VAT_RATE));
    //   VLERA FATURIMIT: kur OSHEE, vetem PARTNER FEE. Perndryshe, ENERGJI + FEE.
    if (FAT_PARTNER_ENERGY_ROW_IDX >= 0) {
        setFormulaCell(sheet, INV_PARTNER_ROW_IDX, COL_PA_TVSH,
            `${cellRef(FAT_PARTNER_ENERGY_ROW_IDX, COL_PA_TVSH)}+${cellRef(FAT_PARTNER_FEE_ROW_IDX, COL_PA_TVSH)}`,
            invoicePartnerExVAT);
        setFormulaCell(sheet, INV_PARTNER_ROW_IDX, COL_TVSH,
            `${cellRef(FAT_PARTNER_ENERGY_ROW_IDX, COL_TVSH)}+${cellRef(FAT_PARTNER_FEE_ROW_IDX, COL_TVSH)}`,
            invoicePartnerVAT);
        setFormulaCell(sheet, INV_PARTNER_ROW_IDX, COL_ME_TVSH,
            `${cellRef(FAT_PARTNER_ENERGY_ROW_IDX, COL_ME_TVSH)}+${cellRef(FAT_PARTNER_FEE_ROW_IDX, COL_ME_TVSH)}`,
            invoicePartnerIncVAT);
    } else {
        setFormulaCell(sheet, INV_PARTNER_ROW_IDX, COL_PA_TVSH,
            cellRef(FAT_PARTNER_FEE_ROW_IDX, COL_PA_TVSH), invoicePartnerExVAT);
        setFormulaCell(sheet, INV_PARTNER_ROW_IDX, COL_TVSH,
            cellRef(FAT_PARTNER_FEE_ROW_IDX, COL_TVSH), invoicePartnerVAT);
        setFormulaCell(sheet, INV_PARTNER_ROW_IDX, COL_ME_TVSH,
            cellRef(FAT_PARTNER_FEE_ROW_IDX, COL_ME_TVSH), invoicePartnerIncVAT);
    }

    // FATURIM VEGA NDAJ PARTNER:
    //   SHERBIM KARIKIMI — perputhet me referencen FJORTES:
    //     D (kWh) = SUM e rreshtave SHITJE ME KARTE CASH nga KONSUMI (kolona D)
    //     F (Vlere pa TVSH) = SUM e rreshtave SHITJE ME KARTE CASH nga KONSUMI (kolona F)
    //     E (çmim shitje) = F/D  (mesatare e ponderuar — jo llogaritje D*E)
    //     G (TVSH) = F*0.2 ; H (Vlere me TVSH) = F+G
    if (kartCashKonsumiRowIdxs.length > 0) {
        // Rreshtat jane te njepasnjeshem (grupimi behet ne KONSUMI ne rend te SHITJE ME KARTE CASH),
        // por perdorim nje shprehje me + ne rast se s'jane (defensive).
        const kwhRefs = kartCashKonsumiRowIdxs.map(r => cellRef(r, COL_KWH)).join('+');
        const paRefs = kartCashKonsumiRowIdxs.map(r => cellRef(r, COL_PA_TVSH)).join('+');
        setFormulaCell(sheet, FAT_VEGA_SERVICE_ROW_IDX, COL_KWH, kwhRefs, kartCashKwh);
        setFormulaCell(sheet, FAT_VEGA_SERVICE_ROW_IDX, COL_PA_TVSH, paRefs, kartCashRevExVAT);
        setFormulaCell(sheet, FAT_VEGA_SERVICE_ROW_IDX, COL_PRICE,
            `${cellRef(FAT_VEGA_SERVICE_ROW_IDX, COL_PA_TVSH)}/${cellRef(FAT_VEGA_SERVICE_ROW_IDX, COL_KWH)}`,
            kartCashAvgRateExVAT);
    } else {
        // Rasti kur s'ka SHITJE ME KARTE CASH — fallback tek zero.
        setFormulaCell(sheet, FAT_VEGA_SERVICE_ROW_IDX, COL_PA_TVSH,
            `${cellRef(FAT_VEGA_SERVICE_ROW_IDX, COL_KWH)}*${cellRef(FAT_VEGA_SERVICE_ROW_IDX, COL_PRICE)}`,
            kartCashRevExVAT);
    }
    setFormulaCell(sheet, FAT_VEGA_SERVICE_ROW_IDX, COL_TVSH,
        `${cellRef(FAT_VEGA_SERVICE_ROW_IDX, COL_PA_TVSH)}*${VAT_RATE}`, kartCashVAT);
    setFormulaCell(sheet, FAT_VEGA_SERVICE_ROW_IDX, COL_ME_TVSH,
        `${cellRef(FAT_VEGA_SERVICE_ROW_IDX, COL_PA_TVSH)}+${cellRef(FAT_VEGA_SERVICE_ROW_IDX, COL_TVSH)}`,
        kartCashRevIncVAT);
    //   VLERA FATURIMIT = reference SHERBIM KARIKIMI (nje-rresht-item).
    setFormulaCell(sheet, INV_VEGA_ROW_IDX, COL_PA_TVSH,
        cellRef(FAT_VEGA_SERVICE_ROW_IDX, COL_PA_TVSH), kartCashRevExVAT);
    setFormulaCell(sheet, INV_VEGA_ROW_IDX, COL_TVSH,
        cellRef(FAT_VEGA_SERVICE_ROW_IDX, COL_TVSH), kartCashVAT);
    setFormulaCell(sheet, INV_VEGA_ROW_IDX, COL_ME_TVSH,
        cellRef(FAT_VEGA_SERVICE_ROW_IDX, COL_ME_TVSH), kartCashRevIncVAT);

    // FITIMI NETO (i Vega-s) = TOTALI SHITJE (pa TVSH) − KOSTO ENERGJI (pa TVSH) − PARTNER FEE (pa TVSH)
    // Ekuivalente: MARZHI BRUTO − NDARJA PARTNER = NDARJA VEGA.
    setFormulaCell(sheet, FITIMI_NETO_ROW_IDX, COL_PA_TVSH,
        `${cellRef(TOTAL_SALE_ROW_IDX, COL_PA_TVSH)}-${cellRef(KOSTO_TOTAL_ROW_IDX, COL_PA_TVSH)}-${cellRef(NDARJA_PARTNER_ROW_IDX, COL_PA_TVSH)}`,
        vegaEarning);

    // DETYRIM AKTUAL — reference VLERA FATURIMIT me TVSH.
    setFormulaCell(sheet, DET_PARTNER_AKTUAL_ROW_IDX, COL_ME_TVSH,
        cellRef(INV_PARTNER_ROW_IDX, COL_ME_TVSH), invoicePartnerIncVAT);
    setFormulaCell(sheet, DET_VEGA_AKTUAL_ROW_IDX, COL_ME_TVSH,
        cellRef(INV_VEGA_ROW_IDX, COL_ME_TVSH), kartCashRevIncVAT);
    // 🆕 Rreshti NETIM u hoq — nuk sherbente per procesin e faturimit.

    // Styling:
    // Header row.
    for (let c = 1; c <= LAST_COL; c++) {
        applyStyleToCell(sheet, XLSXStyle.utils.encode_cell({ r: HEADER_ROW_IDX, c }), STYLE_HEADER_CELL);
    }
    // Titull faturimi rreshti 1.
    applyStyleToCell(sheet, XLSXStyle.utils.encode_cell({ r: 0, c: 1 }), STYLE_INVOICE_TITLE);
    applyStyleToCell(sheet, XLSXStyle.utils.encode_cell({ r: 0, c: 2 }), STYLE_INVOICE_TITLE);
    applyStyleToCell(sheet, XLSXStyle.utils.encode_cell({ r: 1, c: 1 }), STYLE_INVOICE_TITLE);
    applyStyleToCell(sheet, XLSXStyle.utils.encode_cell({ r: 1, c: 2 }), STYLE_INVOICE_TITLE);

    // Data rows (nga rreshti pas header-it deri para TOTAL_SALE_ROW_IDX).
    for (let r = HEADER_ROW_IDX + 1; r < TOTAL_SALE_ROW_IDX - 1; r++) {
        for (let c = 0; c <= LAST_COL; c++) {
            const style = (c >= NUM_START) ? STYLE_NUMBER_CELL : STYLE_DATA_CELL;
            applyStyleToCell(sheet, XLSXStyle.utils.encode_cell({ r, c }), style);
        }
    }
    // Bold rows (charger×grouping me disa cmime).
    for (const rIdx of boldRowIndices) {
        for (let c = 0; c <= LAST_COL; c++) {
            const style = (c >= NUM_START) ? STYLE_NUMBER_CELL_BOLD : STYLE_DATA_CELL_BOLD;
            applyStyleToCell(sheet, XLSXStyle.utils.encode_cell({ r: rIdx, c }), style);
        }
    }

    // 🆕 CHARGER hyperlinks — kolona B ne rreshtat e tabeles kryesore.
    // Klikimi mbi emrin e chargerit hap sheet-in perkates me detajet e karikimeve.
    const boldRowSet = new Set(boldRowIndices);
    const COL_CHARGER = 1;
    for (let idx = 0; idx < rows.length; idx++) {
        const r = MAIN_DATA_FIRST_ROW + idx;
        const chargerName = rows[idx].charger;
        const sheetName = chargerSheetMap.get(chargerName);
        if (!sheetName) continue;
        const addr = cellRef(r, COL_CHARGER);
        if (!sheet[addr]) sheet[addr] = { t: 's', v: chargerName };
        // Excel internal link: `#'Sheet Name'!A1` (quote sheet name qe te dale ok me hapesira/karaktere).
        (sheet[addr] as any).l = {
            Target: `#'${sheetName}'!A1`,
            Tooltip: `Hap detajet e karikimeve per: ${chargerName}`,
        };
        // Style: blu me underline (bold nese rreshti ka disa cmime per te njejtin grupim × charger).
        const style = boldRowSet.has(r) ? STYLE_HYPERLINK_CELL_BOLD : STYLE_HYPERLINK_CELL;
        (sheet[addr] as any).s = style;
    }
    // TOTALI I SHITJEVE row.
    applyStyleToRow(sheet, TOTAL_SALE_ROW_IDX, 0, LAST_COL, STYLE_TOTAL_ROW);
    applyStyleToCell(sheet, XLSXStyle.utils.encode_cell({ r: TOTAL_SALE_ROW_IDX, c: 2 }), STYLE_TOTAL_LABEL);
    // KONSUMI header row.
    applyStyleToRow(sheet, KONSUMI_HEADER_ROW_IDX, 1, LAST_COL, STYLE_HEADER_CELL);
    // KONSUMI total row.
    applyStyleToRow(sheet, KONSUMI_TOTAL_ROW_IDX, 0, LAST_COL, STYLE_TOTAL_ROW);
    applyStyleToCell(sheet, XLSXStyle.utils.encode_cell({ r: KONSUMI_TOTAL_ROW_IDX, c: 2 }), STYLE_TOTAL_LABEL);
    // ENERGY title.
    applyStyleToRow(sheet, ENERGY_HEADER_ROW_IDX, 2, 2, STYLE_SECTION_TITLE);
    applyStyleToRow(sheet, KOSTO_TOTAL_ROW_IDX, 0, LAST_COL, STYLE_TOTAL_ROW);
    applyStyleToCell(sheet, XLSXStyle.utils.encode_cell({ r: KOSTO_TOTAL_ROW_IDX, c: 2 }), STYLE_TOTAL_LABEL);
    // MARZHI row — sfond portokalli.
    applyStyleToRow(sheet, MARZHI_ROW_IDX, 0, LAST_COL, STYLE_MARZHI_ROW);
    applyStyleToCell(sheet, XLSXStyle.utils.encode_cell({ r: MARZHI_ROW_IDX, c: 2 }), STYLE_MARZHI_LABEL);
    // NDARJA header + FATURIMI MUJOR + FATURIM headers + INFORMACION PAGESE — bande te lehta.
    applyStyleToRow(sheet, NDARJA_HEADER_ROW_IDX, 2, LAST_COL, STYLE_SECTION_TITLE);
    applyStyleToRow(sheet, FATURIMI_MUJOR_TITLE_ROW_IDX, 2, LAST_COL, STYLE_SECTION_TITLE);
    applyStyleToRow(sheet, FAT_PARTNER_HEADER_ROW_IDX, 2, LAST_COL, STYLE_HEADER_CELL);
    applyStyleToRow(sheet, FAT_VEGA_HEADER_ROW_IDX, 2, LAST_COL, STYLE_HEADER_CELL);
    // VLERA FATURIMIT rreshtat — total row look.
    applyStyleToRow(sheet, INV_PARTNER_ROW_IDX, 2, LAST_COL, STYLE_TOTAL_ROW);
    applyStyleToCell(sheet, XLSXStyle.utils.encode_cell({ r: INV_PARTNER_ROW_IDX, c: 2 }), STYLE_TOTAL_LABEL);
    applyStyleToRow(sheet, INV_VEGA_ROW_IDX, 2, LAST_COL, STYLE_TOTAL_ROW);
    applyStyleToCell(sheet, XLSXStyle.utils.encode_cell({ r: INV_VEGA_ROW_IDX, c: 2 }), STYLE_TOTAL_LABEL);
    // FITIMI NETO — portokalli e lehte.
    applyStyleToRow(sheet, FITIMI_NETO_ROW_IDX, 2, LAST_COL, STYLE_MARZHI_ROW);
    applyStyleToCell(sheet, XLSXStyle.utils.encode_cell({ r: FITIMI_NETO_ROW_IDX, c: 2 }), STYLE_MARZHI_LABEL);
    // INFORMACION PER PAGESE + DETYRIM titles.
    applyStyleToRow(sheet, INFO_PAGESE_TITLE_ROW_IDX, 2, LAST_COL, STYLE_SECTION_TITLE);
    applyStyleToRow(sheet, DET_PARTNER_TITLE_ROW_IDX, 2, LAST_COL, STYLE_SECTION_TITLE);
    applyStyleToRow(sheet, DET_VEGA_TITLE_ROW_IDX, 2, LAST_COL, STYLE_SECTION_TITLE);
    // DETYRIMI AKTUAL — total row look (NETIM u hoq).
    applyStyleToRow(sheet, DET_PARTNER_AKTUAL_ROW_IDX, 2, LAST_COL, STYLE_TOTAL_ROW);
    applyStyleToCell(sheet, XLSXStyle.utils.encode_cell({ r: DET_PARTNER_AKTUAL_ROW_IDX, c: 2 }), STYLE_TOTAL_LABEL);
    applyStyleToRow(sheet, DET_VEGA_AKTUAL_ROW_IDX, 2, LAST_COL, STYLE_TOTAL_ROW);
    applyStyleToCell(sheet, XLSXStyle.utils.encode_cell({ r: DET_VEGA_AKTUAL_ROW_IDX, c: 2 }), STYLE_TOTAL_LABEL);

    // Column widths — 9 kolona (A..I) me kolonen e fundit e boshe (padding).
    sheet['!cols'] = [
        { wch: 5 },   // A: #
        { wch: 30 },  // B: CHARGER
        { wch: 40 },  // C: REZULTATI I PIKES SIPAS KLIENTEVE
        { wch: 12 },  // D: kWh
        { wch: 12 },  // E: çmim shitje (pa TVSH)
        { wch: 16 },  // F: Vlere pa TVSH
        { wch: 14 },  // G: TVSH 20%
        { wch: 16 },  // H: Vlere me TVSH
        { wch: 4 },   // I: padding
    ];

    return sheet;
};

// 3) Sheet per-charger — 4 sub-tabela sipas grupimit.
const buildChargerSheet = (
    charger: string,
    sessionsByGrouping: Record<Grouping, any[]>,
): XLSXStyle.WorkSheet => {
    // 🆕 Location e re — ngjit me Charge Point (kolona e dyte).
    const headers = [
        'Charge Point', 'Location', 'Capacity', 'User', 'User Group', 'RFID Serial No',
        'Start Date', 'Start Time', 'End Time', 'Duration (hh:mm:ss)',
        'Energy (kWh)', 'Rate (Lek/kWh)', 'Value (Lek)',
    ];
    const NUM_COLS = headers.length; // 13 kolona
    const emptyRow = () => new Array(NUM_COLS).fill('');
    // Kolonat me numra fillojne nga indeksi 10 (Energy) — Rate + Value ne 11, 12.
    // SUBTOTAL/GRAND TOTAL: label ne indeks 9 (Duration), value ne 10 (Energy) + 12 (Value).
    const SUBTOTAL_LABEL_COL = 9;
    const KWH_COL = 10;
    const VALUE_COL = 12;

    const aoa: any[][] = [];
    const boldTotalRowIdxs: number[] = [];
    const subHeaderRowIdxs: number[] = [];
    let grandKwh = 0;
    let grandValue = 0;

    for (const g of GROUPINGS_ORDER) {
        const sessions = sessionsByGrouping[g] || [];
        // Sub-title.
        const subTitleRow = emptyRow();
        subTitleRow[0] = g;
        aoa.push(subTitleRow);
        subHeaderRowIdxs.push(aoa.length - 1);
        // Column headers.
        aoa.push([...headers]);

        if (sessions.length === 0) {
            const emptySession = emptyRow();
            emptySession[0] = '(pa sesione)';
            aoa.push(emptySession);
        } else {
            let sumKwh = 0;
            let sumValue = 0;
            for (const s of sessions) {
                const kwh = num(s['Energy (kWh)']);
                const rate = num(s['Sale Rate (Lek/kWh)']);
                const value = num(s['Sale Revenue (Lek)']);
                sumKwh += kwh;
                sumValue += value;
                aoa.push([
                    s['Charge Point'] || '',
                    s['Location'] || '',
                    s['Capacity'] || '',
                    s['User'] || '',
                    s['UserGroup'] || '',
                    (!s['RFID Serial No'] || String(s['RFID Serial No']).trim().toLowerCase() === 'unknown')
                        ? 'Remote Start' : s['RFID Serial No'],
                    s['Start Date'] || '',
                    s['Start Time'] || '',
                    s['End Time'] || '',
                    s['formattedDuration'] || s['Duration (min)'] || '',
                    Number(kwh.toFixed(2)),
                    Number(rate.toFixed(2)),
                    Number(value.toFixed(2)),
                ]);
            }
            const subtotalRow = emptyRow();
            subtotalRow[SUBTOTAL_LABEL_COL] = 'SUBTOTAL';
            subtotalRow[KWH_COL] = Number(sumKwh.toFixed(2));
            subtotalRow[VALUE_COL] = Number(sumValue.toFixed(2));
            aoa.push(subtotalRow);
            boldTotalRowIdxs.push(aoa.length - 1);
            grandKwh += sumKwh;
            grandValue += sumValue;
        }
        // Empty separator.
        aoa.push(emptyRow());
    }

    // Grand total.
    const grandRow = emptyRow();
    grandRow[SUBTOTAL_LABEL_COL] = 'GRAND TOTAL';
    grandRow[KWH_COL] = Number(grandKwh.toFixed(2));
    grandRow[VALUE_COL] = Number(grandValue.toFixed(2));
    aoa.push(grandRow);
    const grandTotalRowIdx = aoa.length - 1;

    const sheet = XLSXStyle.utils.aoa_to_sheet(aoa);
    // Style sub-titles & column headers.
    for (const rIdx of subHeaderRowIdxs) {
        applyStyleToRow(sheet, rIdx, 0, headers.length - 1, STYLE_SUBHEADER_ROW);
        // Header kolonash right after (rIdx + 1).
        applyStyleToRow(sheet, rIdx + 1, 0, headers.length - 1, STYLE_HEADER_CELL);
    }
    // Data cells styling (numric cells: Duration(9), Energy(10), Rate(11), Value(12)).
    // Duration eshte string por trajtimi si numer nuk shkakton konflikt — mban align-in
    // e djathte per konsistence me rreshtat SUBTOTAL/GRAND TOTAL.
    for (let r = 0; r < aoa.length; r++) {
        for (let c = 0; c < headers.length; c++) {
            const addr = XLSXStyle.utils.encode_cell({ r, c });
            if (!sheet[addr]) continue;
            if ((sheet[addr] as any).s) continue; // Skip cells that already have style.
            const style = (c >= 10) ? STYLE_NUMBER_CELL : STYLE_DATA_CELL;
            applyStyleToCell(sheet, addr, style);
        }
    }
    // Bold total rows.
    for (const rIdx of boldTotalRowIdxs) {
        applyStyleToRow(sheet, rIdx, 0, headers.length - 1, STYLE_TOTAL_ROW);
    }
    applyStyleToRow(sheet, grandTotalRowIdx, 0, headers.length - 1, STYLE_TOTAL_ROW);

    sheet['!cols'] = [
        { wch: 24 },  // Charge Point
        { wch: 22 },  // Location
        { wch: 10 },  // Capacity
        { wch: 22 },  // User
        { wch: 24 },  // User Group
        { wch: 22 },  // RFID Serial No
        { wch: 12 },  // Start Date
        { wch: 10 },  // Start Time
        { wch: 10 },  // End Time
        { wch: 14 },  // Duration
        { wch: 12 },  // Energy (kWh)
        { wch: 14 },  // Rate
        { wch: 14 },  // Value
    ];

    return sheet;
};

// ── Public API ────────────────────────────────────────────────────────────

// 🆕 Ndertim i workbook-ut te plote — perdoret nga te dyja te dyja pikat e hyrjes
// (save + build buffer). Pre-llogarit charger → sheetName qe FATURE SHITJE hyperlinks
// te reference sheet-et perkate te chargerit.
const buildPartnerWorkbook = (
    reportMetadata: any[],
    partnerName: string,
    reportPartnerId: number | null,
    partnerSplitPct: number,
    from: string,
    to: string,
    energyInvoicingSource: string | null = 'OSHEE',
): any => {
    const wb = XLSXStyle.utils.book_new();

    // Pre-compute charger sheet names (evito dublikate + limit 31 karaktere).
    const { chargerNames, sheetNameMap } = buildChargerSheetNameMap(reportMetadata || []);

    // Sheet 1: General.
    const shGen = buildGeneralSheet(reportMetadata || []);
    XLSXStyle.utils.book_append_sheet(wb, shGen, 'General');

    // Sheet 2: FATURE SHITJE (me hyperlinks per çdo charger).
    const fatureSheetName = sanitizeSheetName(`FATURE SHITJE_${formatPeriodForSheetName(from, to)}`);
    const shFature = buildFatureShitjeSheet(
        reportMetadata || [], partnerName, reportPartnerId, partnerSplitPct, from, to, sheetNameMap, energyInvoicingSource,
    );
    XLSXStyle.utils.book_append_sheet(wb, shFature, fatureSheetName);

    // Sheets per-charger (perdorim emrat e llogaritur me lart per konsistence me hyperlinks).
    for (const charger of chargerNames) {
        const grouped: Record<Grouping, any[]> = {
            'KLIENT/ KOMPANI': [],
            'VEGA STAFF': [],
            'KLIENT FUNDOR': [],
            'SHITJE ME KARTE CASH': [],
        };
        for (const s of (reportMetadata || [])) {
            if (s['Charge Point'] !== charger) continue;
            if (num(s['Energy (kWh)']) <= 0) continue;
            const g = classifySession(s, reportPartnerId);
            grouped[g].push(s);
        }
        const sheetName = sheetNameMap.get(charger)!;
        const shCh = buildChargerSheet(charger, grouped);
        XLSXStyle.utils.book_append_sheet(wb, shCh, sheetName);
    }

    return wb;
};

export const buildPartnerReportBuffer = (
    reportMetadata: any[],
    partnerName: string,
    reportPartnerId: number | null,
    partnerSplitPct: number,
    from: string,
    to: string,
    energyInvoicingSource: string | null = 'OSHEE',
): ArrayBuffer => {
    const wb = buildPartnerWorkbook(reportMetadata, partnerName, reportPartnerId, partnerSplitPct, from, to, energyInvoicingSource);
    const wbout = XLSXStyle.write(wb, { bookType: 'xlsx', type: 'array' });
    return wbout as ArrayBuffer;
};

export const savePartnerReport = (
    reportMetadata: any[],
    partnerName: string,
    reportPartnerId: number | null,
    partnerSplitPct: number,
    from: string,
    to: string,
    energyInvoicingSource: string | null = 'OSHEE',
): void => {
    const wb = buildPartnerWorkbook(reportMetadata, partnerName, reportPartnerId, partnerSplitPct, from, to, energyInvoicingSource);
    const safePartner = String(partnerName || 'Partner').replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_+|_+$/g, '');
    const period = formatPeriodForSheetName(from, to);
    const fileName = `${period}_${safePartner}_raport_shitje.xlsx`;
    XLSXStyle.writeFile(wb, fileName);
};
