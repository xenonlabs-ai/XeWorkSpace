import { Layout } from "@/components/layout"
import { MemberProfileContent } from "@/components/members/profile/profile-content"

interface MemberProfilePageProps {
	params: {
		id: string
	}
}

export default function MemberProfilePage({ params }: MemberProfilePageProps) {
	return (
		<Layout>
			<MemberProfileContent memberId={params.id} />
		</Layout>
	)
}
