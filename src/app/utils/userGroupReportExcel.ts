/**
 * Helper per te ndertuar Excel-in e User Group Report me struktura te vecanta + styling.
 *
 * Perdor `xlsx-js-style` (drop-in per `xlsx` me styles support ne output) qe fill/font
 * te ruhen ne file. Vanilla `xlsx` community ignore-on cell.s ne write.
 *
 * ⚠️ IMPORTANT: Nese caller-i e ruan file-in me `XLSX.writeFile` nga librari e ndryshme
 *    (p.sh. vanilla 'xlsx'), styles-t do te hiqen. Prandaj eksportojme edhe
 *    `saveUserGroupReport(...)` qe perdor internally xlsx-js-style writeFile.
 *
 * Struktura e file-it:
 *   Sheet 1: FATURE SHITJE_<periudha>   — invoice summary grupuar per rate
 *   Sheet 2: RMD_<ugName>                — VETEM aggregate per RFID card me hyperlinks
 *   Sheet 3: Charging History            — VETEM detail rows (i njejti format i export-it aktual UG)
 *   Sheets 4..N: <serial>_detail         — per-card detail
 */
import * as XLSXStyle from 'xlsx-js-style';

// ── Constants — style palette ───────────────────────────────────────────────
const COLOR_BRAND = '931623';
const COLOR_WHITE = 'FFFFFF';
const COLOR_TOTAL_ROW = 'FFF3CD';
const COLOR_INVOICE_BAND = 'E9F5D8';
const COLOR_INFO_BOX = 'FDECEA';
const COLOR_HYPERLINK = '0563C1';
const COLOR_ZEBRA = 'F5F5F5';

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

const STYLE_TOTAL_ROW: any = {
    fill: { patternType: 'solid', fgColor: { rgb: COLOR_TOTAL_ROW } },
    font: { bold: true, sz: 11 },
    alignment: { horizontal: 'right', vertical: 'center' },
    border: {
        top: { style: 'medium', color: { rgb: '999999' } },
        bottom: { style: 'medium', color: { rgb: '999999' } },
    },
    // 🆕 Number format me thousands separator + 2 shifra dhjetore. Ignore-ohet nga
    // cell-at me tekst (p.sh. "TOTALI SHITJEVE"), aplikohet vetem tek numeric cells.
    numFmt: '#,##0.00',
};

const STYLE_INVOICE_TITLE: any = {
    fill: { patternType: 'solid', fgColor: { rgb: COLOR_INVOICE_BAND } },
    font: { bold: true, sz: 12 },
    alignment: { horizontal: 'left', vertical: 'center' },
};

const STYLE_INFO_LABEL: any = {
    fill: { patternType: 'solid', fgColor: { rgb: COLOR_INFO_BOX } },
    font: { bold: true, sz: 10 },
    alignment: { horizontal: 'left', vertical: 'center' },
};

const STYLE_INFO_VALUE: any = {
    fill: { patternType: 'solid', fgColor: { rgb: COLOR_INFO_BOX } },
    font: { bold: true, sz: 11 },
    alignment: { horizontal: 'right', vertical: 'center' },
    numFmt: '#,##0.00',
};

const STYLE_HYPERLINK: any = {
    font: { color: { rgb: COLOR_HYPERLINK }, underline: true, sz: 11 },
    alignment: { horizontal: 'left', vertical: 'center' },
};

const STYLE_DATA_CELL: any = {
    font: { sz: 10 },
    alignment: { horizontal: 'left', vertical: 'center' },
};

const STYLE_DATA_CELL_ZEBRA: any = {
    fill: { patternType: 'solid', fgColor: { rgb: COLOR_ZEBRA } },
    font: { sz: 10 },
    alignment: { horizontal: 'left', vertical: 'center' },
};

const STYLE_NUMBER_CELL: any = {
    font: { sz: 10 },
    alignment: { horizontal: 'right', vertical: 'center' },
    numFmt: '#,##0.00',
};

const STYLE_NUMBER_CELL_ZEBRA: any = {
    fill: { patternType: 'solid', fgColor: { rgb: COLOR_ZEBRA } },
    font: { sz: 10 },
    alignment: { horizontal: 'right', vertical: 'center' },
    numFmt: '#,##0.00',
};

// ── Utilities ──────────────────────────────────────────────────────────────

const sanitizeSheetName = (raw: string, maxLen: number = 31): string => {
    const cleaned = String(raw || 'Sheet')
        .replace(/[\[\]:\\\/\?\*]/g, '_')
        .replace(/\s+/g, ' ')
        .trim();
    return cleaned.substring(0, maxLen) || 'Sheet';
};

// Formatimi i periudhes per titullin e sheet/fatures:
//   MUAJ I PLOTE (nga 1 ne diten e fundit te te njejtit muaj) → `MM_YYYY` (p.sh. `07_2026`)
//   Ndryshe → `YYYY-MM-DD_YYYY-MM-DD` (p.sh. `2026-07-01_2026-07-21` per periudhe te pjeseshme)
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

    // Muaj i plote = same year+month + from.day===1 + to.day===last day i muajit.
    if (fy === ty && fm === tm && fd === 1) {
        // Dita e fundit e muajit: new Date(year, month, 0).getDate() (month eshte 1-based
        // ne string-un tone, JS ka 0-based; new Date(year, fm, 0) = last day of month fm).
        const lastDayOfMonth = new Date(fy, fm, 0).getDate();
        if (td === lastDayOfMonth) {
            return `${fmStr}_${fyStr}`;
        }
    }
    // Periudhe e pjeseshme ose multi-month → format i plote.
    return `${from}_${to}`;
};

const formatPeriodForHeader = (from: string, to: string): string => `${from} → ${to}`;

const applyStyleToRow = (sheet: XLSXStyle.WorkSheet, rowIdx: number, colStart: number, colEnd: number, style: any) => {
    for (let c = colStart; c <= colEnd; c++) {
        const addr = XLSXStyle.utils.encode_cell({ r: rowIdx, c });
        if (!sheet[addr]) sheet[addr] = { t: 's', v: '' };
        (sheet[addr] as any).s = style;
    }
};

const applyStyleToCell = (sheet: XLSXStyle.WorkSheet, addr: string, style: any) => {
    if (!sheet[addr]) sheet[addr] = { t: 's', v: '' };
    (sheet[addr] as any).s = style;
};

// 🆕 Kolona qe DUHET TE HIQEN nga UG report Excel (sipas kerkeses):
//   - Flags konfigurimi: Check Fisc, Allow Pay As You Go, Send Invoice By Email
//   - formattedDuration (duplikat i Duration (min))
//   - Idle Fee, Idle Minutes, Charging Cost (duplikate/te panevojshme)
const UG_EXCLUDED_COLUMNS = new Set<string>([
    'Check Fisc',
    'Allow Pay As You Go',
    'Send Invoice By Email',
    'formattedDuration',
    'Idle Fee',
    'Idle Minutes',
    'Charging Cost',
]);

// 🆕 Kolonat qe duhet te dalin ne fund, ne kete rend:
//   Energy (Kwh) → Price Me TVSH → Price Pa TVSH → Total Amount Me TVSH → Total Amount Pa TVSH
// DB i mban Price + Total Amount ME TVSH (nga charging_history.total_cost + rate_per_days.price).
// Variantet Pa TVSH llogariten duke pjesetuar me 1.2 ne resolveUGCell.
const UG_VAT_RATE = 0.2;
const UG_LAST_COLUMNS = [
    'Energy (Kwh)',
    'Price Me TVSH', 'Price Pa TVSH',
    'Total Amount Me TVSH', 'Total Amount Pa TVSH',
];

// 🆕 Ndertimi i kolonave finale per UG report:
//   1. Filtro te perjashtuara + kolonat legacy 'Price'/'Total Amount' qe zevendesohen me
//      variantet Me TVSH + Pa TVSH.
//   2. Zhvendos 5 kolonat e fundit (Energy + Price×2 + Total Amount×2) ne fund.
const LEGACY_PRICE_KEYS = new Set(['Price', 'Total Amount']);
const buildUGColumnList = (reportRows: any[]): string[] => {
    if (!reportRows || reportRows.length === 0) return [];
    const firstRow = reportRows[0];
    const allKeys = Object.keys(firstRow);
    const filtered = allKeys.filter(k =>
        !UG_EXCLUDED_COLUMNS.has(k)
        && !UG_LAST_COLUMNS.includes(k)
        && !LEGACY_PRICE_KEYS.has(k)  // fshij 'Price'/'Total Amount' e vjeter — dalin me Me/Pa TVSH.
    );
    // Sigurohu qe 5 fushat e fundit dalin ne fund me sakte, edhe nese s'ekzistojne ne row.
    return [...filtered, ...UG_LAST_COLUMNS];
};

// 🆕 Merr vleren e nje qelize per UG report — me suport per variantet Me TVSH + Pa TVSH.
// KONVENTA: Price + Total Amount ne DB ruhen ME TVSH; Pa TVSH llogaritet duke pjesetuar me 1.2.
const resolveUGCell = (row: any, colName: string): any => {
    // Ndihmes: shkalla e mbrojtur me TVSH nga rreshti (fallback Total/Energy nese Price mungon).
    const getPriceIncVAT = (): number => {
        const existing = parseFloat(row?.['Price']);
        if (Number.isFinite(existing) && existing > 0) return existing;
        const total = parseFloat(row?.['Total Amount'] ?? row?.['Total Cost'] ?? row?.['Sale Revenue (Lek)']) || 0;
        const energy = parseFloat(row?.['Energy (Kwh)'] ?? row?.['Energy (kWh)']) || 0;
        return energy > 0 ? total / energy : 0;
    };
    const getTotalIncVAT = (): number => {
        const v = parseFloat(row?.['Total Amount'] ?? row?.['Total Cost'] ?? row?.['Sale Revenue (Lek)']);
        return Number.isFinite(v) ? v : 0;
    };

    if (colName === 'Price Me TVSH' || colName === 'Price') {
        const v = getPriceIncVAT();
        return v > 0 ? Number(v.toFixed(2)) : 0;
    }
    if (colName === 'Price Pa TVSH') {
        const v = getPriceIncVAT();
        return v > 0 ? Number((v / (1 + UG_VAT_RATE)).toFixed(2)) : 0;
    }
    if (colName === 'Total Amount Me TVSH' || colName === 'Total Amount') {
        const v = getTotalIncVAT();
        return Number(v.toFixed(2));
    }
    if (colName === 'Total Amount Pa TVSH') {
        const v = getTotalIncVAT();
        return Number((v / (1 + UG_VAT_RATE)).toFixed(2));
    }
    if (colName === 'Energy (Kwh)') {
        const v = parseFloat(row?.['Energy (Kwh)'] ?? row?.['Energy (kWh)']);
        return Number.isFinite(v) ? Number(v.toFixed(2)) : (row?.[colName] ?? '');
    }
    return row?.[colName] ?? '';
};

// ── Group by rate ──────────────────────────────────────────────────────────

type InvoiceLine = { ugName: string, kWh: number, rate: number, value: number };

const groupByRate = (reportRows: any[], ugName: string): InvoiceLine[] => {
    const map = new Map<number, { kWh: number, value: number }>();
    for (const row of reportRows || []) {
        const kwh = parseFloat(row?.['Energy (kWh)'] ?? row?.['Energy (Kwh)']) || 0;
        if (kwh <= 0) continue;
        const total = parseFloat(row?.['Total Amount'] ?? row?.['Total Cost'] ?? row?.['Sale Revenue (Lek)']) || 0;
        let rate = parseFloat(row?.['Sale Rate (Lek/kWh)'] ?? row?.['Rate Price']);
        if (!Number.isFinite(rate) || rate <= 0) rate = kwh > 0 ? total / kwh : 0;
        rate = Math.round(rate * 100) / 100;
        const existing = map.get(rate) || { kWh: 0, value: 0 };
        existing.kWh += kwh;
        existing.value += total;
        map.set(rate, existing);
    }
    return Array.from(map.entries())
        .sort((a, b) => a[0] - b[0])
        .map(([rate, { kWh, value }]) => ({
            ugName,
            kWh: Number(kWh.toFixed(2)),
            rate: Number(rate.toFixed(2)),
            value: Number(value.toFixed(2)),
        }));
};

// ── Sheet 1: Fature Shitje ─────────────────────────────────────────────────

function buildInvoiceSheet(reportRows: any[], ugName: string, from: string, to: string): { sheet: XLSXStyle.WorkSheet, name: string } {
    const periodShort = formatPeriodForSheetName(from, to);
    const periodLong = formatPeriodForHeader(from, to);
    const invoiceLabel = `FATURE SHITJE_${periodShort}`;

    const invoiceLines = groupByRate(reportRows, ugName);
    const totalKwh = invoiceLines.reduce((s, l) => s + l.kWh, 0);
    const totalValue = invoiceLines.reduce((s, l) => s + l.value, 0);

    const aoa: any[][] = [];
    aoa.push(['PERIUDHE FATURIMIT:', '', invoiceLabel, '']);
    aoa.push(['', `(${periodLong})`, '', 'LEKE']);
    aoa.push([]);
    aoa.push(['REZULTATI I PIKES', 'kWh', 'çmim shitje me TVSH', 'Vlere me TVSH']);
    for (const line of invoiceLines) {
        aoa.push([line.ugName, line.kWh, line.rate, line.value]);
    }
    aoa.push(['TOTALI SHITJEVE', Number(totalKwh.toFixed(2)), '', Number(totalValue.toFixed(2))]);
    aoa.push([]);
    aoa.push(['INFORMACION PER PAGESE']);
    aoa.push(['Pagesa do te kryhet brenda 30 diteve nga data e leshimit te fatures.']);
    aoa.push([]);
    aoa.push(['Detyrimi aktual', '', '', Number(totalValue.toFixed(2))]);

    const sheet = XLSXStyle.utils.aoa_to_sheet(aoa);
    sheet['!cols'] = [{ wch: 28 }, { wch: 16 }, { wch: 24 }, { wch: 22 }];

    // Styles
    applyStyleToRow(sheet, 0, 0, 3, STYLE_INVOICE_TITLE);
    applyStyleToCell(sheet, 'B2', { font: { italic: true, sz: 10, color: { rgb: '666666' } } });
    applyStyleToCell(sheet, 'D2', { font: { bold: true, sz: 10, color: { rgb: '666666' } }, alignment: { horizontal: 'right' } });

    applyStyleToRow(sheet, 3, 0, 3, STYLE_HEADER_CELL);

    const dataStart = 4;
    const dataEnd = dataStart + invoiceLines.length - 1;
    for (let r = dataStart; r <= dataEnd; r++) {
        applyStyleToCell(sheet, XLSXStyle.utils.encode_cell({ r, c: 0 }), STYLE_DATA_CELL);
        applyStyleToCell(sheet, XLSXStyle.utils.encode_cell({ r, c: 1 }), STYLE_NUMBER_CELL);
        applyStyleToCell(sheet, XLSXStyle.utils.encode_cell({ r, c: 2 }), STYLE_NUMBER_CELL);
        applyStyleToCell(sheet, XLSXStyle.utils.encode_cell({ r, c: 3 }), STYLE_NUMBER_CELL);
    }

    const totalRowIdx = dataEnd + 1;
    applyStyleToRow(sheet, totalRowIdx, 0, 3, STYLE_TOTAL_ROW);

    const infoTitleRow = totalRowIdx + 2;
    applyStyleToRow(sheet, infoTitleRow, 0, 3, {
        fill: { patternType: 'solid', fgColor: { rgb: COLOR_INVOICE_BAND } },
        font: { bold: true, sz: 11 },
    });
    const detyrimiRow = infoTitleRow + 3;
    applyStyleToRow(sheet, detyrimiRow, 0, 2, STYLE_INFO_LABEL);
    applyStyleToCell(sheet, XLSXStyle.utils.encode_cell({ r: detyrimiRow, c: 3 }), STYLE_INFO_VALUE);

    sheet['!rows'] = [
        { hpt: 22 }, { hpt: 16 }, { hpt: 8 }, { hpt: 24 },
    ];

    return { sheet, name: sanitizeSheetName(invoiceLabel) };
}

// ── Sheet 2: RMD_<ugName> — VETEM aggregate per card ──────────────────────

function buildAggregateSheet(reportRows: any[], ugName: string, cardSheetNames: Map<string, string>):
    { sheet: XLSXStyle.WorkSheet, name: string } {

    // Grupim per RFID serial no.
    const cardMap = new Map<string, number>();
    for (const row of reportRows || []) {
        const serial = String(row?.['RFID Serial No'] || 'Started remote');
        const kwh = parseFloat(row?.['Energy (kWh)'] ?? row?.['Energy (Kwh)']) || 0;
        cardMap.set(serial, (cardMap.get(serial) || 0) + kwh);
    }

    const aggregate = Array.from(cardMap.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([serial, kWh]) => ({ serial, kWh: Number(kWh.toFixed(2)) }));

    const grandTotal = aggregate.reduce((s, a) => s + a.kWh, 0);

    // AOA
    const aoa: any[][] = [];
    aoa.push(['Row Labels', 'Sum of Energy (kWh)']);
    for (const a of aggregate) {
        aoa.push([a.serial, a.kWh]);
    }
    aoa.push(['Grand Total', Number(grandTotal.toFixed(2))]);

    const sheet = XLSXStyle.utils.aoa_to_sheet(aoa);
    sheet['!cols'] = [{ wch: 32 }, { wch: 24 }];

    // Header row
    applyStyleToRow(sheet, 0, 0, 1, STYLE_HEADER_CELL);

    // Data rows me hyperlinks + zebra
    for (let i = 0; i < aggregate.length; i++) {
        const rowIdx = 1 + i;
        const serial = aggregate[i].serial;
        const targetSheet = cardSheetNames.get(serial);
        const isEven = i % 2 === 0;
        // Row Labels — hyperlink me underline+blu
        const hyperlinkStyle = isEven
            ? { ...STYLE_HYPERLINK, fill: { patternType: 'solid', fgColor: { rgb: COLOR_ZEBRA } } }
            : STYLE_HYPERLINK;
        const addr0 = XLSXStyle.utils.encode_cell({ r: rowIdx, c: 0 });
        (sheet[addr0] as any) = {
            t: 's',
            v: serial,
            s: hyperlinkStyle,
        };
        if (targetSheet) {
            (sheet[addr0] as any).l = {
                Target: `#'${targetSheet}'!A1`,
                Tooltip: `Open details for ${serial}`,
            };
        }
        // kWh — numer
        applyStyleToCell(sheet, XLSXStyle.utils.encode_cell({ r: rowIdx, c: 1 }),
            isEven ? STYLE_NUMBER_CELL_ZEBRA : STYLE_NUMBER_CELL);
    }

    // Grand Total row
    const grandTotalRowIdx = 1 + aggregate.length;
    applyStyleToRow(sheet, grandTotalRowIdx, 0, 1, STYLE_TOTAL_ROW);

    return { sheet, name: sanitizeSheetName(`RMD_${ugName}`) };
}

// ── Sheet 3: Charging History — VETEM detail rows ─────────────────────────

function buildDetailSheet(reportRows: any[]): { sheet: XLSXStyle.WorkSheet, name: string } {
    // 🆕 Lista e filtruar + reorder e kolonave (Energy/Price/Total Amount ne fund).
    const headers = buildUGColumnList(reportRows);
    const dataAoa = reportRows.map(r => headers.map(h => resolveUGCell(r, h)));
    const aoa = [headers, ...dataAoa];
    const sheet = XLSXStyle.utils.aoa_to_sheet(aoa);

    // Column widths — kolona te ngushta per kompaktesi (14 chars).
    sheet['!cols'] = headers.map(() => ({ wch: 14 }));

    // Header row
    applyStyleToRow(sheet, 0, 0, headers.length - 1, STYLE_HEADER_CELL);

    // Data rows me zebra
    for (let i = 0; i < reportRows.length; i++) {
        const rowIdx = 1 + i;
        const isEven = i % 2 === 0;
        const style = isEven ? STYLE_DATA_CELL_ZEBRA : STYLE_DATA_CELL;
        applyStyleToRow(sheet, rowIdx, 0, headers.length - 1, style);
    }

    return { sheet, name: 'Charging History' };
}

// ── Sheets 4..N: per-card detail ───────────────────────────────────────────

function buildCardDetailSheets(reportRows: any[]): { name: string, sheet: XLSXStyle.WorkSheet, serial: string }[] {
    const cardMap = new Map<string, any[]>();
    for (const row of reportRows || []) {
        const serial = String(row?.['RFID Serial No'] || 'Started remote');
        if (!cardMap.has(serial)) cardMap.set(serial, []);
        cardMap.get(serial)!.push(row);
    }

    // Emrat unike per sheet-e.
    const usedNames = new Set<string>();
    const results: { name: string, sheet: XLSXStyle.WorkSheet, serial: string }[] = [];

    for (const [serial, rows] of cardMap.entries()) {
        const suffix = '_detail';
        const maxSerialLen = 31 - suffix.length;
        let base = sanitizeSheetName(serial, maxSerialLen);
        let candidate = `${base}${suffix}`;
        let counter = 2;
        while (usedNames.has(candidate)) {
            const truncBase = base.substring(0, maxSerialLen - String(counter).length);
            candidate = `${truncBase}${counter}${suffix}`;
            counter++;
        }
        usedNames.add(candidate);

        const totalKwh = rows.reduce((s, r) => s + (parseFloat(r?.['Energy (kWh)'] ?? r?.['Energy (Kwh)']) || 0), 0);
        // 🆕 Kolona te filtruara + Energy/Price/Total Amount ne fund (i njejti pattern si sheet Charging History).
        const headers = buildUGColumnList(rows);
        const introRows: any[][] = [
            [`Details for RFID Serial No: ${serial}`],
            [`Total kWh: ${totalKwh.toFixed(2)}`],
            [],
        ];
        const dataAoa = rows.map(r => headers.map(h => resolveUGCell(r, h)));
        const fullAoa = [...introRows, headers, ...dataAoa];
        const sheet = XLSXStyle.utils.aoa_to_sheet(fullAoa);
        sheet['!cols'] = headers.map(() => ({ wch: 14 }));

        // Styles
        applyStyleToCell(sheet, 'A1', { font: { bold: true, sz: 12, color: { rgb: COLOR_BRAND } } });
        applyStyleToCell(sheet, 'A2', { font: { bold: true, sz: 11 } });
        applyStyleToRow(sheet, 3, 0, headers.length - 1, STYLE_HEADER_CELL);
        for (let i = 0; i < rows.length; i++) {
            const rowIdx = 4 + i;
            const isEven = i % 2 === 0;
            applyStyleToRow(sheet, rowIdx, 0, headers.length - 1,
                isEven ? STYLE_DATA_CELL_ZEBRA : STYLE_DATA_CELL);
        }

        results.push({ name: candidate, sheet, serial });
    }

    return results;
}

// ── Main builder ────────────────────────────────────────────────────────────

/**
 * Nderton workbook-un e plote per User Group Report:
 *   Sheet 1: FATURE SHITJE_<periudha>
 *   Sheet 2: RMD_<ugName> — aggregate ONLY, me hyperlinks
 *   Sheet 3: Charging History — detail rows ONLY
 *   Sheets 4..N: <serial>_detail
 */
export function buildUserGroupReportWorkbook(
    reportRows: any[],
    ugName: string,
    fromDate: string,
    toDate: string,
): XLSXStyle.WorkBook {
    const wb: XLSXStyle.WorkBook = { Sheets: {}, SheetNames: [] } as any;

    // Ndert card sheets pare qe te dime emrat per hyperlinks.
    const cardSheets = buildCardDetailSheets(reportRows);
    const cardSheetNames = new Map<string, string>();
    for (const cs of cardSheets) cardSheetNames.set(cs.serial, cs.name);

    // Sheet 1: Invoice
    const { sheet: invoiceSheet, name: invoiceName } = buildInvoiceSheet(reportRows, ugName, fromDate, toDate);
    wb.Sheets[invoiceName] = invoiceSheet;
    wb.SheetNames.push(invoiceName);

    // Sheet 2: Aggregate ONLY (RMD)
    const { sheet: aggSheet, name: aggName } = buildAggregateSheet(reportRows, ugName, cardSheetNames);
    wb.Sheets[aggName] = aggSheet;
    wb.SheetNames.push(aggName);

    // Sheet 3: Charging History (detail rows)
    const { sheet: detailSheet, name: detailName } = buildDetailSheet(reportRows);
    wb.Sheets[detailName] = detailSheet;
    wb.SheetNames.push(detailName);

    // Sheets 4..N: per-card details
    for (const cs of cardSheets) {
        wb.Sheets[cs.name] = cs.sheet;
        wb.SheetNames.push(cs.name);
    }

    return wb;
}

/**
 * Kthen ArrayBuffer me styles te ruajtura (perdor xlsx-js-style write).
 * Perdoret per Send Report flow (multipart upload tek backend per email).
 */
export function buildUserGroupReportBuffer(
    reportRows: any[],
    ugName: string,
    fromDate: string,
    toDate: string,
): ArrayBuffer {
    const wb = buildUserGroupReportWorkbook(reportRows, ugName, fromDate, toDate);
    // 🆕 Perdor `xlsx-js-style` write qe styles-t te ruhen ne output.
    return XLSXStyle.write(wb, { bookType: 'xlsx', type: 'array' });
}

/**
 * Ruajtja lokale e file-it me styles te ruajtura.
 * Perdoret per Export Excel manual — perdor xlsx-js-style writeFile qe cell.s
 * te ruhet (vanilla xlsx writeFile e strip-on).
 */
export function saveUserGroupReport(
    reportRows: any[],
    ugName: string,
    fromDate: string,
    toDate: string,
    fileName?: string,
): void {
    const wb = buildUserGroupReportWorkbook(reportRows, ugName, fromDate, toDate);
    const safeName = String(ugName).replace(/[^a-zA-Z0-9]+/g, '_');
    const finalFileName = fileName || `UserGroupReport_${safeName}_${fromDate}_${toDate}.xlsx`;
    // 🆕 xlsx-js-style writeFile — ruajne styles.
    XLSXStyle.writeFile(wb, finalFileName);
}
