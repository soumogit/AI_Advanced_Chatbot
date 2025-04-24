"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Video, FileText, Search, ExternalLink } from "lucide-react"

interface HealthResourcesProps {
  className?: string
}

export function HealthResources({ className }: HealthResourcesProps) {
  const [searchTerm, setSearchTerm] = useState("")

  // Sample resources for demonstration
  const articles = [
    {
      id: "1",
      title: "Understanding Blood Pressure",
      description: "Learn about blood pressure readings and what they mean for your health.",
      category: "Heart Health",
      url: "#",
    },
    {
      id: "2",
      title: "The Importance of Regular Exercise",
      description: "Discover how regular physical activity benefits your overall health.",
      category: "Fitness",
      url: "#",
    },
    {
      id: "3",
      title: "Nutrition Basics: Building a Balanced Diet",
      description: "Learn the fundamentals of nutrition and how to create balanced meals.",
      category: "Nutrition",
      url: "#",
    },
    {
      id: "4",
      title: "Managing Stress in Daily Life",
      description: "Effective strategies for managing stress and improving mental wellbeing.",
      category: "Mental Health",
      url: "#",
    },
    {
      id: "5",
      title: "Sleep Hygiene: Tips for Better Sleep",
      description: "Practical advice for improving your sleep quality and duration.",
      category: "Sleep",
      url: "#",
    },
  ]

  const videos = [
    {
      id: "1",
      title: "5-Minute Stress Relief Exercises",
      description: "Quick and effective exercises to reduce stress and anxiety.",
      duration: "5:32",
      url: "#",
    },
    {
      id: "2",
      title: "Understanding Your Lab Results",
      description: "A guide to interpreting common laboratory test results.",
      duration: "8:45",
      url: "#",
    },
    {
      id: "3",
      title: "Home Workout Routine: No Equipment Needed",
      description: "A simple workout routine you can do at home without any equipment.",
      duration: "12:20",
      url: "#",
    },
  ]

  const guides = [
    {
      id: "1",
      title: "Diabetes Management Guide",
      description: "Comprehensive guide for managing diabetes and maintaining health.",
      pages: 24,
      url: "#",
    },
    {
      id: "2",
      title: "Heart Health Handbook",
      description: "Essential information for maintaining cardiovascular health.",
      pages: 32,
      url: "#",
    },
    {
      id: "3",
      title: "Mental Wellness Toolkit",
      description: "Strategies and resources for maintaining good mental health.",
      pages: 18,
      url: "#",
    },
  ]

  // Filter resources based on search term
  const filteredArticles = articles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredVideos = videos.filter(
    (video) =>
      video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredGuides = guides.filter(
    (guide) =>
      guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guide.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className={className}>
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search health resources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <Tabs defaultValue="articles">
        <TabsList className="mb-4">
          <TabsTrigger value="articles">
            <BookOpen className="h-4 w-4 mr-2" />
            Articles
          </TabsTrigger>
          <TabsTrigger value="videos">
            <Video className="h-4 w-4 mr-2" />
            Videos
          </TabsTrigger>
          <TabsTrigger value="guides">
            <FileText className="h-4 w-4 mr-2" />
            Guides
          </TabsTrigger>
        </TabsList>

        <TabsContent value="articles" className="space-y-3">
          {filteredArticles.length > 0 ? (
            filteredArticles.map((article) => (
              <div key={article.id} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-medium">{article.title}</h4>
                  <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded-full">
                    {article.category}
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{article.description}</p>
                <Button variant="outline" size="sm" className="text-xs w-full">
                  Read Article
                  <ExternalLink className="h-3 w-3 ml-1" />
                </Button>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-gray-500 dark:text-gray-400">
              No articles found matching your search.
            </div>
          )}
        </TabsContent>

        <TabsContent value="videos" className="space-y-3">
          {filteredVideos.length > 0 ? (
            filteredVideos.map((video) => (
              <div key={video.id} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-medium">{video.title}</h4>
                  <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded-full">
                    {video.duration}
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{video.description}</p>
                <Button variant="outline" size="sm" className="text-xs w-full">
                  Watch Video
                  <ExternalLink className="h-3 w-3 ml-1" />
                </Button>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-gray-500 dark:text-gray-400">
              No videos found matching your search.
            </div>
          )}
        </TabsContent>

        <TabsContent value="guides" className="space-y-3">
          {filteredGuides.length > 0 ? (
            filteredGuides.map((guide) => (
              <div key={guide.id} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-medium">{guide.title}</h4>
                  <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded-full">
                    {guide.pages} pages
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{guide.description}</p>
                <Button variant="outline" size="sm" className="text-xs w-full">
                  Download Guide
                  <ExternalLink className="h-3 w-3 ml-1" />
                </Button>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-gray-500 dark:text-gray-400">
              No guides found matching your search.
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
