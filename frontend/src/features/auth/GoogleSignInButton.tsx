import { GoogleLogin, type CredentialResponse } from '@react-oauth/google'
import { useAppDispatch } from '@/app/hooks'
import { googleLogin } from './authSlice'

export default function GoogleSignInButton() {
  const dispatch = useAppDispatch()

  const onSuccess = (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) return
    dispatch(googleLogin(credentialResponse.credential))
  }

  return (
    <div className="flex justify-center">
      <GoogleLogin
        onSuccess={onSuccess}
        onError={() => {
          /* surfaced via authSlice.error on the next real attempt; GIS shows its own popup errors */
        }}
        theme="filled_black"
        shape="rectangular"
        text="continue_with"
        size="large"
        width="320"
      />
    </div>
  )
}
