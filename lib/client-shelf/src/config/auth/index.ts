import baseInstance from "@/api/baseInstance";
import { useAuth } from "@book-shelf/auth-util";

const auth = useAuth(baseInstance);

export default auth;