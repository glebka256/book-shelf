import { useAuth } from "@book-shelf/auth-util";
import baseInstance from "./axios";

const auth = useAuth(baseInstance);

export default auth;