import { notFound, redirect } from "next/navigation"
import { Container } from "@/components/container"
import { Header } from "@/components/header"
import { SubmissionEntry } from "@/components/submission-entry"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { createClient } from "@/lib/supabase/server"
import { Submission } from "@/types"

interface ProfileStats {
  averageRating: number | null
  totalSubmissions: number
  activeDays: number
}

function StatCard({ title, value, helper }: { title: string; value: string; helper?: string }) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="text-sm font-semibold text-gray-600">{title}</div>
      <div className="mt-2 text-3xl font-bold text-gray-900">{value}</div>
      {helper != null && <div className="mt-1 text-sm text-gray-500">{helper}</div>}
    </div>
  )
}

function formatRating(rating: number | null) {
  if (rating == null) return "No ratings yet"
  return `${rating.toFixed(1)} / 10`
}

function formatDays(count: number) {
  return `${count} day${count === 1 ? "" : "s"}`
}

async function getProfileData(userId: string): Promise<{
  submissions: Submission[]
  favoritedSubmissions: Submission[]
  stats: ProfileStats
}> {
  const supabase = await createClient()

  const { data: submissionsData, error: submissionsError } = await supabase
    .from("submissions")
    .select("id, setup, punchline, createdAt:created_at, analysis")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (submissionsError != null) {
    console.error(submissionsError)
    throw new Error("Unable to load your submissions.")
  }

  const submissions = submissionsData ?? []
  const submissionIds = submissions.map((submission) => submission.id)

  const favoriteLookup = new Set<string>()
  const favoritedSubmissions: Submission[] = []

  const { data: favoritesData, error: favoritesError } = await supabase
    .from("favorites")
    .select("created_at, submission:submissions(id, setup, punchline, analysis, createdAt:created_at)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (favoritesError != null) {
    console.error(favoritesError)
    throw new Error("Unable to load your favorites.")
  }

  favoritesData?.forEach((favorite) => {
    const submission = favorite.submission
    if (submission != null) {
      favoriteLookup.add(submission.id)
      favoritedSubmissions.push({ ...submission, isFavorited: true })
    }
  })

  const submissionsWithFavorites = submissions.map((submission) => ({
    ...submission,
    isFavorited: favoriteLookup.has(submission.id),
  }))

  let averageRating: number | null = null

  if (submissionIds.length > 0) {
    const { data: votesData, error: votesError } = await supabase
      .from("votes")
      .select("submission_id, score")
      .in("submission_id", submissionIds)

    if (votesError != null) {
      console.error(votesError)
      throw new Error("Unable to load your ratings.")
    }

    const scores = votesData?.map((vote) => vote.score) ?? []
    const totalScore = scores.reduce((total, score) => total + score, 0)
    averageRating = scores.length > 0 ? totalScore / scores.length : null
  }

  const activeDays = new Set(
    submissions
      .map((submission) => submission.createdAt?.slice(0, 10))
      .filter((day): day is string => Boolean(day)),
  ).size

  return {
    submissions: submissionsWithFavorites,
    favoritedSubmissions,
    stats: {
      averageRating,
      totalSubmissions: submissions.length,
      activeDays,
    },
  }
}

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()
  const user = data.user

  if (user == null) {
    redirect("/")
  }

  const profileData = await getProfileData(user.id)

  if (profileData == null) {
    return notFound()
  }

  return (
    <Container>
      <Header />

      <main className="space-y-6 pb-16">
        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-500">Signed in as</p>
              <h1 className="text-2xl font-bold text-gray-900">{user.email}</h1>
            </div>
            <div className="text-sm text-gray-600">Your personal Uproar stats</div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <StatCard
              title="Average rating"
              value={formatRating(profileData.stats.averageRating)}
              helper="Based on votes across your submissions"
            />
            <StatCard title="Total submissions" value={`${profileData.stats.totalSubmissions}`} />
            <StatCard
              title="Days with submissions"
              value={formatDays(profileData.stats.activeDays)}
              helper="Unique calendar days with at least one submission"
            />
          </div>
        </section>

        <section className="space-y-4 rounded-2xl border bg-white p-6 shadow-sm">
          <header className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase text-gray-500">Your work</p>
              <h2 className="text-xl font-bold text-gray-900">Your submissions</h2>
            </div>
            <div className="text-sm text-gray-500">All submissions you have made</div>
          </header>

          {profileData.submissions.length === 0 ? (
            <Empty className="border border-dashed">
              <EmptyHeader>
                <EmptyMedia variant="icon">😅</EmptyMedia>
                <EmptyTitle>No submissions yet</EmptyTitle>
                <EmptyDescription>Submit a punchline to see it listed here.</EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <div className="space-y-3">
              {profileData.submissions.map((submission) => (
                <SubmissionEntry key={submission.id} submission={submission} />
              ))}
            </div>
          )}
        </section>

        <section className="space-y-4 rounded-2xl border bg-white p-6 shadow-sm">
          <header className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase text-gray-500">Favorites</p>
              <h2 className="text-xl font-bold text-gray-900">Saved submissions</h2>
            </div>
            <div className="text-sm text-gray-500">Everything you have favorited</div>
          </header>

          {profileData.favoritedSubmissions.length === 0 ? (
            <Empty className="border border-dashed">
              <EmptyHeader>
                <EmptyMedia variant="icon">📁</EmptyMedia>
                <EmptyTitle>No favorites yet</EmptyTitle>
                <EmptyDescription>
                  Favorite submissions to quickly revisit the punchlines you love.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <div className="space-y-3">
              {profileData.favoritedSubmissions.map((submission) => (
                <SubmissionEntry key={submission.id} submission={submission} />
              ))}
            </div>
          )}
        </section>
      </main>
    </Container>
  )
}
