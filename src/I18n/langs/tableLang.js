import i18n from '../i18n'
const tableLang = {
  localeText: {
    // Set Filter
    selectAll: i18n.t('table.selectAll'),
    selectAllSearchResults: 'daSelect All Search Results',
    searchOoo: i18n.t('table.searchOoo'),
    blanks: 'daBlanks',
    noMatches: 'daNo matches.',

    // Number Filter & Text Filter
    filterOoo: 'daFilter...',
    equals: 'daEquals',
    notEqual: 'daNot equal',

    // Number Filter
    lessThan: 'daLess than',
    greaterThan: 'daGreater than',
    lessThanOrEqual: 'daLess than or equal',
    greaterThanOrEqual: 'daGreater than or equal',
    inRange: 'daIn range',
    inRangeStart: 'daTo',
    inRangeEnd: 'daFrom',

    // Text Filter
    contains: 'daContains',
    notContains: 'daNot contains',
    startsWith: 'daStarts with',
    endsWith: 'daEnds with',

    // Date Filter
    dateFormatOoo: 'daYyyy-mm-dd',

    // Filter Conditions
    andCondition: 'daAND',
    orCondition: 'daOR',

    // Filter Buttons
    applyFilter: 'daApply',
    resetFilter: 'daReset',
    clearFilter: 'daClear',
    cancelFilter: 'daCancel',

    // Side Bar
    columns: '列',
    filters: '筛选',

    // columns tool panel
    pivotMode: 'laPivot Mode',
    groups: '行分组',
    rowGroupColumnsEmptyMessage: '拖动行至此分组',
    values: 'laValues',
    valueColumnsEmptyMessage: 'laDrag here to aggregate',
    pivots: 'laColumn Labels',
    pivotColumnsEmptyMessage: 'laDrag here to set column labels',

    // Header of the Default Group Column
    group: 'laGroup',

    // Other
    loadingOoo: 'daLoading...',
    noRowsToShow: 'laNo Rows To Show',
    enabled: 'laEnabled',

    // Menu
    pinColumn: '固定列',
    pinLeft: '固定在左侧',
    pinRight: '固定在右侧',
    noPin: '取消固定',
    valueAggregation: 'laValue Aggregation',
    autosizeThiscolumn: '自适应列宽',
    autosizeAllColumns: '自适应所有列宽',
    groupBy: 'laGroup by',
    ungroupBy: 'laUn-Group by',
    resetColumns: '重置列',
    expandAll: 'laExpand All',
    collapseAll: 'laClose All',
    copy: 'laCopy',
    ctrlC: 'laCtrl+C',
    copyWithHeaders: 'laCopy With Headers',
    paste: 'laPaste',
    ctrlV: 'laCtrl+V',
    export: 'laExport',
    csvExport: 'laCSV Export',
    excelExport: 'laExcel Export (.xlsx)',
    excelXmlExport: 'laExcel Export (.xml)',

    // Enterprise Menu Aggregation and Status Bar
    sum: 'laSum',
    min: 'laMin',
    max: 'laMax',
    none: 'laNone',
    count: 'laCount',
    avg: 'laAverage',
    filteredRows: '筛选行',
    selectedRows: 'laSelected',
    totalRows: '总行数',
    totalAndFilteredRows: '行数',
    page: 'daPage',
    more: 'daMore',
    to: 'daTo',
    of: 'of',
    next: 'daNext',
    last: 'daLast',
    first: 'daFirst',
    previous: 'daPrevious',

    // Enterprise Menu (Charts)
    pivotChartAndPivotMode: 'laPivot Chart & Pivot Mode',
    pivotChart: 'laPivot Chart',
    chartRange: 'laChart Range',

    columnChart: 'laColumn',
    groupedColumn: 'laGrouped',
    stackedColumn: 'laStacked',
    normalizedColumn: 'la100% Stacked',

    barChart: 'laBar',
    groupedBar: 'laGrouped',
    stackedBar: 'laStacked',
    normalizedBar: 'la100% Stacked',

    pieChart: 'laPie',
    pie: 'laPie',
    doughnut: 'laDoughnut',

    line: 'laLine',

    xyChart: 'laX Y (Scatter)',
    scatter: 'laScatter',
    bubble: 'laBubble',

    areaChart: 'laArea',
    area: 'laArea',
    stackedArea: 'laStacked',
    normalizedArea: 'la100% Stacked',

    histogramChart: 'laHistogram',

    // Charts
    pivotChartTitle: 'laPivot Chart',
    rangeChartTitle: 'laRange Chart',
    settings: 'laSettings',
    data: 'laData',
    format: 'laFormat',
    categories: 'laCategories',
    defaultCategory: '(laNone)',
    series: 'laSeries',
    xyValues: 'laX Y Values',
    paired: 'laPaired Mode',
    axis: 'laAxis',
    color: 'laColor',
    thickness: 'laThickness',
    xType: 'laX Type',
    automatic: 'laAutomatic',
    category: 'laCategory',
    number: 'laNumber',
    time: 'laTime',
    xRotation: 'laX Rotation',
    yRotation: 'laY Rotation',
    ticks: 'laTicks',
    width: 'laWidth',
    height: 'laHeight',
    length: 'laLength',
    padding: 'laPadding',
    chart: 'laChart',
    title: 'laTitle',
    background: 'laBackground',
    font: 'laFont',
    top: 'laTop',
    right: 'laRight',
    bottom: 'laBottom',
    left: 'laLeft',
    labels: 'laLabels',
    size: 'laSize',
    minSize: 'laMinimum Size',
    maxSize: 'laMaximum Size',
    legend: 'laLegend',
    position: 'laPosition',
    markerSize: 'laMarker Size',
    markerStroke: 'laMarker Stroke',
    markerPadding: 'laMarker Padding',
    itemPaddingX: 'laItem Padding X',
    itemPaddingY: 'laItem Padding Y',
    strokeWidth: 'laStroke Width',
    offset: 'laOffset',
    offsets: 'laOffsets',
    tooltips: 'laTooltips',
    callout: 'laCallout',
    markers: 'laMarkers',
    shadow: 'laShadow',
    blur: 'laBlur',
    xOffset: 'laX Offset',
    yOffset: 'laY Offset',
    lineWidth: 'laLine Width',
    normal: 'laNormal',
    bold: 'laBold',
    italic: 'laItalic',
    boldItalic: 'laBold Italic',
    predefined: 'laPredefined',
    fillOpacity: 'laFill Opacity',
    strokeOpacity: 'laLine Opacity',
    histogramBinCount: 'laBin Count',
    columnGroup: 'laColumn',
    barGroup: 'laBar',
    pieGroup: 'laPie',
    lineGroup: 'laLine',
    scatterGroup: 'laScatter',
    areaGroup: 'laArea',
    histogramGroup: 'laHistogram',
    groupedColumnTooltip: 'laGrouped',
    stackedColumnTooltip: 'laStacked',
    normalizedColumnTooltip: 'la100% Stacked',
    groupedBarTooltip: 'laGrouped',
    stackedBarTooltip: 'laStacked',
    normalizedBarTooltip: 'la100% Stacked',
    pieTooltip: 'laPie',
    doughnutTooltip: 'laDoughnut',
    lineTooltip: 'laLine',
    groupedAreaTooltip: 'laGrouped',
    stackedAreaTooltip: 'laStacked',
    normalizedAreaTooltip: 'la100% Stacked',
    scatterTooltip: 'laScatter',
    bubbleTooltip: 'laBubble',
    histogramTooltip: 'laHistogram',
    noDataToChart: 'laNo data available to be charted.',
    pivotChartRequiresPivotMode: 'laPivot Chart requires Pivot Mode enabled.',
    navigator: 'laNavigator'
  }
}
export default tableLang
