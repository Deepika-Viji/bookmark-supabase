"use client"

import { useEffect, useState } from "react"
import { supabase } from "../lib/supabaseClient"
import GoogleIcon from "../src/assets/google.svg";

export default function Home() {

    const [user, setUser] = useState(null)
    const [bookmarks, setBookmarks] = useState([])
    const [title, setTitle] = useState("")
    const [url, setUrl] = useState("")
    const [checkingAuth, setCheckingAuth] = useState(true)
    const [errors, setErrors] = useState({})

    // Fetch user + bookmarks
    useEffect(() => {
    const getUserAndBookmarks = async () => {
        const { data } = await supabase.auth.getUser()
        const currentUser = data.user

        if (currentUser) {
        setUser(currentUser)
        await fetchBookmarks()
        }

        setCheckingAuth(false)
    }

        getUserAndBookmarks()
    }, [])

    useEffect(() => {
      if (!user) return

      const channel = supabase
        .channel('bookmarks-changes')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'bookmarks' },
          (payload) => {
            fetchBookmarks()
          }
        )
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    }, [user])


    const fetchBookmarks = async () => {
        const { data } = await supabase
        .from("bookmarks")
        .select("*")
        .order("created_at", { ascending: false })

        setBookmarks(data || [])
    }

    // Login
    const login = async () => {
        await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
            redirectTo: `${window.location.origin}`,
            queryParams: {
            prompt: "select_account"
            }
        }
        })
    }

    // Logout
    const logout = async () => {
        await supabase.auth.signOut()
        setUser(null)
    }

    const validate = () => {
        let newErrors = {}

        if (!title.trim()) {
            newErrors.title = "Title is required"
        }

        if (!url.trim()) {
            newErrors.url = "URL is required"
        } else {
            try {
            new URL(url)
            } catch {
            newErrors.url = "Enter a valid URL (include https://)"
            }
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    // Add bookmark
    const addBookmark = async () => {

        if (!validate()) return

        const { data: { user } } = await supabase.auth.getUser()

        await supabase.from("bookmarks").insert([
            {
            title,
            url,
            user_id: user.id
            }
        ])

        setTitle("")
        setUrl("")
        setErrors({})
        fetchBookmarks()
    }


    // Delete bookmark
    const deleteBookmark = async (id) => {
        await supabase.from("bookmarks").delete().eq("id", id)
        fetchBookmarks()
    }

  // Login Screen
    if (!user) {
        if (checkingAuth) {
            return (
                <div className="min-h-screen flex items-center justify-center">
                    <div className="h-6 w-6 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                </div>
            )
        }
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center">

                <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-md text-center">

                    <h1 className="text-2xl font-semibold text-gray-800 mb-2">Smart Bookmark Manager</h1>

                    <p className="text-gray-500 text-sm mb-6">Save and access your favorite links securely</p>

                    <button
                        onClick={login}
                        className="flex items-center justify-center gap-2 w-full border border-gray-300 rounded py-2 hover:bg-gray-50 transition"
                    >
                        <img
                            src={GoogleIcon.src}
                            alt="google"
                            className="w-5 h-5"
                        />
                        <span className="text-gray-700 font-medium"> Continue with Google </span>
                    </button>

                    <p className="text-xs text-gray-400 mt-6"> Secure login powered by Google </p>

                </div>

            </div>
        )
    }

  // Dashboard UI
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center py-10">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-6">

        {/* Header */}
        <div className="flex justify-between items-center border-b pb-4 mb-6">
          <h1 className="text-2xl font-semibold text-gray-800"> Smart Bookmark Manager </h1>

          <button
            onClick={logout}
            className="text-sm bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200"
          >
            Logout
          </button>
        </div>

        {/* Add Bookmark Card */}
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm mb-6">
          <h2 className="text-lg font-medium mb-3 text-gray-700"> Add New Bookmark</h2>

          <div className="grid gap-3">
            <input
                type="text"
                placeholder="Bookmark Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`border rounded p-2 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 
                ${errors.title ? "border-red-400 focus:ring-red-400" : "focus:ring-blue-400"}`}
            />
            {errors.title && (
                <p className="text-red-500 text-xs">{errors.title}</p>
            )}

            <input
                type="text"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className={`border rounded p-2 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 
                ${errors.url ? "border-red-400 focus:ring-red-400" : "focus:ring-blue-400"}`}
            />
            {errors.url && (
                <p className="text-red-500 text-xs">{errors.url}</p>
            )}

            <button
              onClick={addBookmark}
              className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              Add Bookmark
            </button>
          </div>
        </div>

        {/* Bookmark List */}
        <div>
          <h2 className="text-lg font-medium mb-3 text-gray-700">Your Bookmarks</h2>

          {bookmarks.length === 0 ? (
            <p className="text-gray-500 text-sm">No bookmarks added yet.</p>
          ) : (
            <div className="space-y-3">
              {bookmarks.map((b) => (
                <div key={b.id} className="flex justify-between items-center bg-gray-50 p-3 rounded shadow-sm">
                  <div>
                    <p className="font-medium text-gray-800"> {b.title} </p>
                    <a href={b.url} target="_blank" className="text-sm text-blue-600 hover:underline" >{b.url}</a>
                  </div>

                  <button onClick={() => deleteBookmark(b.id)} className="text-sm text-red-500 hover:text-red-700" > Delete </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
