import { TextEncoder, TextDecoder } from 'util';
import dotenv from 'dotenv';

if (!global.TextEncoder) {
  global.TextEncoder = TextEncoder;
}
if (!global.TextDecoder) {
  global.TextDecoder = TextDecoder;
}

dotenv.config();
