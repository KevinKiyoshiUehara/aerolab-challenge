export interface User {
    id: string,
    name: string,
    points: number,
    redeemHistory: any[],
    createDate: Date | string,
  }