/**
 * Helper i perbashket per te ndertuar Excel-in e Company Report me 4 sheets + styling:
 *   Sheet 1: "Company Report"    — rreshtat origjinal (per-sesion).
 *   Sheet 2: "User Groups"       — grumbullim kWh per UG (sorted DESC + N/A + TOTAL).
 *   Sheet 3: "Gas Station"       — grumbullim kWh per Charge Point (sorted DESC + TOTAL).
 *   Sheet 4: "Recharge History"  — rechargers e kompanise ne te njejten periudhe.
 *
 * Perdor `xlsx-js-style` (drop-in per `xlsx` me styles support) qe fill/font
 * te ruhen ne file. Vanilla `xlsx` community ignore-on `cell.s` ne write.
 */
import * as XLSX from 'xlsx-js-style';

// ── Palette e ngjyrave ──────────────────────────────────────────────────────
const COLOR_BRAND = '931623';
const COLOR_WHITE = 'FFFFFF';
const COLOR_TOTAL_ROW = 'FFF3CD';   // amber i qete per TOTAL rows
const COLOR_ZEBRA = 'F5F5F5';       // gri e lehte per zebra alternate
const COLOR_HEADER_BORDER = '999999';

// ── Style constants ─────────────────────────────────────────────────────────
const STYLE_HEADER_CELL: any = {
    fill: { patternType: 'solid', fgColor: { rgb: COLOR_BRAND } },
    font: { bold: true, color: { rgb: COLOR_WHITE }, sz: 11 },
    alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
    border: {
        top: { style: 'thin', color: { rgb: COLOR_HEADER_BORDER } },
        bottom: { style: 'thin', color: { rgb: COLOR_HEADER_BORDER } },
        left: { style: 'thin', color: { rgb: COLOR_HEADER_BORDER } },
        right: { style: 'thin', color: { rgb: COLOR_HEADER_BORDER } },
    },
};

const STYLE_TOTAL_ROW: any = {
    fill: { patternType: 'solid', fgColor: { rgb: COLOR_TOTAL_ROW } },
    font: { bold: true, sz: 11 },
    alignment: { horizontal: 'right', vertical: 'center' },
    border: {
        top: { style: 'medium', color: { rgb: COLOR_HEADER_BORDER } },
        bottom: { style: 'medium', color: { rgb: COLOR_HEADER_BORDER } },
    },
    numFmt: '#,##0.00',
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

// ── Helpers ────────────────────────────────────────────────────────────────

const applyStyleToRow = (sheet: XLSX.WorkSheet, rowIdx: number, colStart: number, colEnd: number, style: any) => {
    for (let c = colStart; c <= colEnd; c++) {
        const addr = XLSX.utils.encode_cell({ r: rowIdx, c });
        if (!sheet[addr]) sheet[addr] = { t: 's', v: '' };
        (sheet[addr] as any).s = style;
    }
};

// Aplikon styling standard tek nje sheet: header row me ngjyre + zebra rows + column widths.
// Cell-at numerike (kur v eshte number) marrin STYLE_NUMBER_CELL variant.
const styleTableSheet = (
    sheet: XLSX.WorkSheet,
    headerCount: number,
    dataRowCount: number,
    numericColumns: Set<number> = new Set(),
) => {
    // Header row
    applyStyleToRow(sheet, 0, 0, headerCount - 1, STYLE_HEADER_CELL);
    // Data rows me zebra
    for (let i = 0; i < dataRowCount; i++) {
        const rowIdx = 1 + i;
        const isEven = i % 2 === 0;
        for (let c = 0; c < headerCount; c++) {
            const addr = XLSX.utils.encode_cell({ r: rowIdx, c });
            if (!sheet[addr]) sheet[addr] = { t: 's', v: '' };
            const isNumeric = numericColumns.has(c);
            let baseStyle: any;
            if (isNumeric) {
                baseStyle = isEven ? STYLE_NUMBER_CELL_ZEBRA : STYLE_NUMBER_CELL;
            } else {
                baseStyle = isEven ? STYLE_DATA_CELL_ZEBRA : STYLE_DATA_CELL;
            }
            (sheet[addr] as any).s = baseStyle;
        }
    }
};

// ── Aggregate builders ─────────────────────────────────────────────────────

// 🆕 Grumbullim per User Groups — kWh totale per cdo grup, N/A per sesionet pa grup.
export function buildUserGroupsAggregate(reportRows: any[]): { 'Row Labels': string, 'Sum of Energy (kWh)': number }[] {
    const map = new Map<string, number>();
    let grandTotal = 0;

    for (const row of reportRows || []) {
        const raw = row?.['UserGroup'];
        const name = (!raw || raw === 'N/A') ? 'N/A' : String(raw);
        const kwh = parseFloat(row?.['Energy (kWh)']) || 0;
        map.set(name, (map.get(name) || 0) + kwh);
        grandTotal += kwh;
    }

    const rows = Array.from(map.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([name, kwh]) => ({
            'Row Labels': name,
            'Sum of Energy (kWh)': Number(kwh.toFixed(2)),
        }));

    rows.push({
        'Row Labels': 'TOTAL',
        'Sum of Energy (kWh)': Number(grandTotal.toFixed(2)),
    });

    return rows;
}

// 🆕 Grumbullim per Charge Point (Gas Station) — kWh totale per cdo charger.
export function buildGasStationAggregate(reportRows: any[]): { 'Row Labels': string, 'Sum of Energy (kWh)': number }[] {
    const map = new Map<string, number>();
    let grandTotal = 0;

    for (const row of reportRows || []) {
        const raw = row?.['Charge Point'];
        const name = (!raw || raw === 'N/A') ? 'N/A' : String(raw);
        const kwh = parseFloat(row?.['Energy (kWh)']) || 0;
        map.set(name, (map.get(name) || 0) + kwh);
        grandTotal += kwh;
    }

    const rows = Array.from(map.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([name, kwh]) => ({
            'Row Labels': name,
            'Sum of Energy (kWh)': Number(kwh.toFixed(2)),
        }));

    rows.push({
        'Row Labels': 'TOTAL',
        'Sum of Energy (kWh)': Number(grandTotal.toFixed(2)),
    });

    return rows;
}

// 🆕 Ndert sheet-in User Groups me styling (header + zebra + TOTAL row).
function buildUserGroupsSheet(reportRows: any[]): XLSX.WorkSheet {
    const rows = buildUserGroupsAggregate(reportRows);
    const sheet = XLSX.utils.json_to_sheet(rows);
    sheet['!cols'] = [{ wch: 40 }, { wch: 22 }];

    // Nga last row eshte TOTAL — style-ohet ndryshe.
    const dataRowCount = rows.length - 1; // pa TOTAL
    styleTableSheet(sheet, 2, dataRowCount, new Set([1])); // col 1 = numeric
    // TOTAL row
    applyStyleToRow(sheet, dataRowCount + 1, 0, 1, STYLE_TOTAL_ROW);

    return sheet;
}

// 🆕 Ndert sheet-in Gas Station me styling.
function buildGasStationSheet(reportRows: any[]): XLSX.WorkSheet {
    const rows = buildGasStationAggregate(reportRows);
    const sheet = XLSX.utils.json_to_sheet(rows);
    sheet['!cols'] = [{ wch: 40 }, { wch: 22 }];

    const dataRowCount = rows.length - 1;
    styleTableSheet(sheet, 2, dataRowCount, new Set([1]));
    applyStyleToRow(sheet, dataRowCount + 1, 0, 1, STYLE_TOTAL_ROW);

    return sheet;
}

// 🆕 Ndert sheet-in Recharge History me styling.
// Format identik me export-in nga /rfid-cards/allrecharges.
export function buildRechargersSheet(rechargers: any[]): XLSX.WorkSheet {
    const rows = (rechargers || []).map(r => ({
        Date: r?.date || '',
        Time: r?.time || '',
        Amount: Number(r?.amount) || 0,
        Recharge_Type: r?.recharge_from || '',
        POK_Order_Status: r?.pokOrderStatus || '',
        Order_Id: r?.display_order_id || r?.pokOrderId || (r?.recharge_id ? `topup-${r.recharge_id}` : ''),
        Company: r?.company || r?.Company?.company_name || '',
        User_Group: r?.userGroup || r?.UserGroup?.usergr_name || '',
        User: r?.user || r?.User?.username || '',
        Made_By: r?.madeBy || '',
    }));
    const sheet = XLSX.utils.json_to_sheet(rows);
    sheet['!cols'] = [
        { wch: 12 }, // Date
        { wch: 10 }, // Time
        { wch: 12 }, // Amount
        { wch: 16 }, // Recharge Type
        { wch: 18 }, // POK Order Status
        { wch: 28 }, // Order Id
        { wch: 22 }, // Company
        { wch: 22 }, // User Group
        { wch: 22 }, // User
        { wch: 18 }, // Made By
    ];

    // Styling — column 2 (Amount) eshte numerike.
    styleTableSheet(sheet, 10, rows.length, new Set([2]));

    return sheet;
}

// 🆕 Kolona qe nuk duhen formatuar si numer decimal (jane ID/identifikator).
// Header-i i tyre permban keto substrings → aplikohet stil me tekst (jo #,##0.00).
const ID_LIKE_HEADER_HINTS = ['id', 'no', 'serial', 'tag'];

// Stil per ID/identifier cells — pa thousands separator, pa dhjetore, left-aligned si tekst.
const STYLE_ID_CELL: any = {
    font: { sz: 10 },
    alignment: { horizontal: 'left', vertical: 'center' },
    numFmt: '0', // plain integer, pa thousands separator
};

const STYLE_ID_CELL_ZEBRA: any = {
    fill: { patternType: 'solid', fgColor: { rgb: COLOR_ZEBRA } },
    font: { sz: 10 },
    alignment: { horizontal: 'left', vertical: 'center' },
    numFmt: '0',
};

// A eshte kjo kolone nje ID/identifier (bazuar ne header)?
const isIdColumn = (headerText: string): boolean => {
    const lower = String(headerText || '').toLowerCase();
    return ID_LIKE_HEADER_HINTS.some(hint => {
        // Match si fjale te vecantaose ne fund/fillim (jo brenda te tjerave — p.sh. "Void" s'kap "id").
        return lower === hint
            || lower.endsWith(` ${hint}`)
            || lower.startsWith(`${hint} `)
            || lower.includes(` ${hint} `);
    });
};

// 🆕 Aplikon styling ne sheet-in kryesor Company Report (te ndertuar nga caller).
// Header row me green + white bold; data rows zebra; heuristic:
//   - Kolonat ID (Charging History ID, RFID Serial No, Id Tag) → text-like (0 format)
//   - Kolonat e tjera numerike → thousands + 2 dhjetore (#,##0.00)
//   - Kolonat text → left-aligned
export function applyStyleToCompanyReportSheet(sheet: XLSX.WorkSheet, headerRowIndex: number = 0): void {
    const range = XLSX.utils.decode_range(sheet['!ref'] || 'A1');
    const totalCols = range.e.c + 1;
    const totalRows = range.e.r + 1;
    if (totalRows <= headerRowIndex) return;

    // Lexo header-at qe te kategorizojme kolonat.
    const headers: string[] = [];
    for (let c = 0; c < totalCols; c++) {
        const addr = XLSX.utils.encode_cell({ r: headerRowIndex, c });
        const cell = (sheet as any)[addr];
        headers.push(String(cell?.v ?? ''));
    }

    // Klasifiko kolonat: idCols (0 format), numericCols (#,##0.00), textCols (left-align).
    const idCols = new Set<number>();
    const numericCols = new Set<number>();
    for (let c = 0; c < totalCols; c++) {
        const header = headers[c];
        // Kontrollo ID first — ka prioritet mbi detektim numerik.
        if (isIdColumn(header)) {
            idCols.add(c);
            continue;
        }
        // Zbulo nese eshte numerik nga rreshti i dyte.
        const addr = XLSX.utils.encode_cell({ r: headerRowIndex + 1, c });
        const cell = (sheet as any)[addr];
        if (cell && (cell.t === 'n' || typeof cell.v === 'number')) {
            numericCols.add(c);
        }
    }

    // Header row
    applyStyleToRow(sheet, headerRowIndex, 0, totalCols - 1, STYLE_HEADER_CELL);

    // Data rows me zebra
    for (let r = headerRowIndex + 1; r < totalRows; r++) {
        const zebraIdx = r - headerRowIndex - 1;
        const isEven = zebraIdx % 2 === 0;
        for (let c = 0; c < totalCols; c++) {
            const addr = XLSX.utils.encode_cell({ r, c });
            if (!sheet[addr]) continue;
            let style: any;
            if (idCols.has(c)) {
                style = isEven ? STYLE_ID_CELL_ZEBRA : STYLE_ID_CELL;
            } else if (numericCols.has(c)) {
                style = isEven ? STYLE_NUMBER_CELL_ZEBRA : STYLE_NUMBER_CELL;
            } else {
                style = isEven ? STYLE_DATA_CELL_ZEBRA : STYLE_DATA_CELL;
            }
            (sheet[addr] as any).s = style;
        }
    }
}

// ── Main workbook builder ───────────────────────────────────────────────────

/**
 * Nderton workbook-un e plote per Company Report me styling.
 * Sheet 1 (Company Report) merret nga jashte si `mainSheet` (nese ekziston), duke
 * ruajtur logjiken specifike te caller-it (headers customo etj). Style-i aplikohet automatikisht.
 * Nese s'jepet, ndertohet nga `json_to_sheet(reportRows)`.
 */
export function buildCompanyReportWorkbook(
    reportRows: any[],
    mainSheet?: XLSX.WorkSheet,
    rechargers?: any[],
): XLSX.WorkBook {
    // Sheet 1: Company Report — vjen nga jashte ose nderto nga rreshtat.
    let sheet1: XLSX.WorkSheet;
    if (mainSheet) {
        sheet1 = mainSheet;
        // Aplikoj styling: prezumojme headerRow = 0. Nese caller ka footer row, mund
        // te mos i aplikojme style — po nuk deshton.
        applyStyleToCompanyReportSheet(sheet1, 0);
    } else {
        sheet1 = XLSX.utils.json_to_sheet(reportRows || []);
        applyStyleToCompanyReportSheet(sheet1, 0);
    }

    const sheet2 = buildUserGroupsSheet(reportRows);
    const sheet3 = buildGasStationSheet(reportRows);

    const wb: XLSX.WorkBook = {
        Sheets: {
            'Company Report': sheet1,
            'User Groups': sheet2,
            'Gas Station': sheet3,
        },
        SheetNames: ['Company Report', 'User Groups', 'Gas Station'],
    };

    // Sheet 4 (opsional): Recharge History nese ka te dhena.
    if (rechargers && rechargers.length > 0) {
        wb.Sheets['Recharge History'] = buildRechargersSheet(rechargers);
        wb.SheetNames.push('Recharge History');
    }

    return wb;
}

/**
 * Ktheu ArrayBuffer me styles te ruajtura — perdor xlsx-js-style write.
 * Perdoret per Send Report flow (multipart upload tek backend per email).
 */
export function buildCompanyReportBuffer(
    reportRows: any[],
    mainSheet?: XLSX.WorkSheet,
    rechargers?: any[],
): ArrayBuffer {
    const wb = buildCompanyReportWorkbook(reportRows, mainSheet, rechargers);
    return XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
}

/**
 * Ruaj file-in lokalisht me styles te ruajtura — perdor xlsx-js-style writeFile.
 * Perdoret per Export Excel manual — vanilla XLSX.writeFile do t'i strip-onte styles.
 */
export function saveCompanyReport(
    workbook: XLSX.WorkBook,
    fileName: string,
): void {
    XLSX.writeFile(workbook, fileName);
}
