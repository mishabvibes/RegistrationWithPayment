import { Mongoose } from 'mongoose';
// global.d.ts
interface Window {
    Razorpay: new (options: any) => any;
}

declare global {
    interface Window {
        Razorpay: any; // or a more specific type if available
    }
}

declare global {
  var mongoose: {
    conn: any | null;
    promise: Promise<any> | null;
  };
}
