export type ModuleId = "dashboard" | "quota" | "community" | "settings";
export type AppError = { code:string; msg:string; fieldErrors?:Record<string,string>; requestId?:string; retryable:boolean };
export type ChartPoint = { label:string; value:number; secondary?:number };

export const trend:ChartPoint[]=[
  {label:"06/01",value:72,secondary:28},{label:"06/05",value:86,secondary:35},{label:"06/09",value:79,secondary:31},
  {label:"06/13",value:108,secondary:42},{label:"06/17",value:104,secondary:48},{label:"06/21",value:132,secondary:55},
  {label:"06/25",value:149,secondary:61},{label:"06/30",value:166,secondary:72},
];
export const heatValues=Array.from({length:42},(_,index)=>18+((index*17+index%5*11)%82));
