import { PasswordStrategy, BCryptStrategy } from "./passwordStrategy";

export {default as authenticationModule} from "./authentication";
export const Password : PasswordStrategy = new PasswordStrategy(new BCryptStrategy());


