import FloatingCornerBackButton from "@/components/ui/atoms/floating-corner-back-button"
import ProfileCard from "@/features/profile/ui/ProfileCard"

const ProfilePage = () => {
  return (
    <main className="overflow-hidden">
        <div className="w-120 mt-30 mx-auto">
          <FloatingCornerBackButton label="Back"/>
          <ProfileCard></ProfileCard>
        </div>
    </main>
  )
}
export default ProfilePage