import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getLoggedInUserDetails } from "../services/api";
import { decryptPayload } from "../services/encryptionAndDecryption";
import { setUserDetails } from "../redux/userSlice";

export const LoginUserDetails  = () => {
  const dispatch = useDispatch();
  const sessionId = useSelector((state) => state.user.sessionId);
  const userDetails = useSelector((state) => state.user.userDetails);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await getLoggedInUserDetails(
          userDetails?.userName,
          sessionId
        );
        const decrypted = await decryptPayload(response?.encryptedResponseData);
        dispatch(setUserDetails(decrypted));
      } catch (err) {
        console.error("Error fetching user details:", err);
      }
    };

    if (userDetails?.userName && sessionId) {
      fetchUserDetails();
    }
  }, [userDetails?.userName, sessionId, dispatch]);
};