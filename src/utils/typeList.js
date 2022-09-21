const subjectList = [
    {
        name: "计量",
        id: '0',
        list: [
            {id: "02", name: "计量-压力真空表"},
            {id: "02A", name: "计量-压力真空表2"},
            {id: "06", name: "计量-电子天平"},
            {id: "09", name: "计量-数字指示秤"},
            {id: "10", name: "计量-非自行指示秤"},
            {id: "13", name: "计量-电流电压表"},
            {id: "14", name: "计量-环境试验设备"},
            {id: "15", name: "计量-温度仪表装置"},
            {id: "15A", name: "计量-温度仪表装置2"},
            {id: "16", name: "计量-可燃气体检测报警器"},
            {id: "17", name: "计量-一氧化碳报警器"}
        ]
    },
    {
        name: "机动车",
        id: '1',
        list: [
            {id: "F1221", name: "机动车-汽车排气污染物检测用底盘测功机"},
            {id: "F1375", name: "机动车-发动机转速测量仪"},
            {id: "F1477", name: "机动车-轮胎花纹深度尺"},
            {id: "F1749", name: "机动车-汽车外廓尺寸检测仪"},
            {id: "F1873", name: "机动车-柴油车氮氧化物（NOx）检测仪"},
            {id: "G1020", name: "机动车-平板式制动检验台"},
            {id: "j01", name: "机动车-测功装置"},
            {id: "j02", name: "机动车-汽车排放气体测试仪"},
            {id: "j03", name: "机动车-汽车侧滑检验台"},
            {id: "j04", name: "机动车-机动车检测专用轴(轮)重仪"},
            {id: "j05", name: "机动车-机动车前照灯检测仪"},
            {id: "j06", name: "机动车-滚筒反力式制动检验台(汽车)"},
            {id: "j06A", name: "机动车-滚筒反力式制动检验台(摩托车)"},
            {id: "j07", name: "机动车-滚筒式车速表检验台"},
            {id: "j08", name: "机动车-透射式烟度计"}
        ]
    },
    {
        name: "环保",
        id: '2',
        list: [
            {id: "G968", name: "环保-烟气分析仪"},
            {id: "h01", name: "环保-COD在线自动监测仪"},
            {id: "h02", name: "环保-烟尘采样器"},
            {id: "h03", name: "环保-氨氮自动监测仪"},
            {id: "h04", name: "环保-二氧化硫气体检测仪"},
            {id: "h05", name: "环保-在线PH计"},
            {id: "h06", name: "环保-化学发光法氮氧化物分析仪"},
            {id: "h07", name: "环保-总磷总氮水质在线分析仪"}
        ]
    }
]

const checkTypeList = [
    {id: "02", name: "后续检定"},
    {id: "20", name: "检验/校验"},
    {id: "11", name: "校准"},
    {id: "09", name: "CMA校准"},
    {id: "10", name: "CNAS校准"},
]

const checkSheetStatus = {
    New: "新建",
    Cache: "缓存",
    ToBeVerified: "待核验",
    ToBeAudit: "待审批",
    ReCheck: "待重检",
    Completed: "已完成"
}

export default {
    subjectList,
    checkTypeList,
    checkSheetStatus
}
