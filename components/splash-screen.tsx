"use client"

import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence, useAnimation, useMotionValue, useTransform } from "framer-motion"
import { Playfair_Display } from "next/font/google"
import {
  Bot,
  Activity,
  Brain,
  HeartPulse,
  Dna,
  Stethoscope,
  Microscope,
  Sparkles,
  Code,
  Cpu,
  Wifi,
  Database,
  Server,
  Layers,
} from "lucide-react"

// Initialize the Playfair Display font
const playfair = Playfair_Display({ subsets: ["latin"] })

export function SplashScreen() {
  const [showParticles, setShowParticles] = useState(false)
  const [showContent, setShowContent] = useState(false)
  const [exitSplash, setExitSplash] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const codeSnippets = [
    "const diagnosis = await analyzeSymptoms(symptoms);",
    "function predictCondition(data) { return model.predict(data); }",
    "class HealthAssistant extends AI { constructor() { super(); } }",
    "import { medicalKnowledge } from '@health/database';",
    "const patientData = await fetchMedicalHistory(patientId);",
    "export function analyzeBloodwork(results) { /* ... */ }",
    "const vitalSigns = monitor.getRealtimeData();",
    "if (temperature > 38.5) return ALERT.FEVER;",
    "async function processMedicalImages(scan) { /* ... */ }",
    "const recommendation = expert.getAdvice(condition);",
  ]

  // Controls for the grid animation
  const gridControls = useAnimation()

  useEffect(() => {
    // Track mouse movement for interactive effects
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        mouseX.set(x)
        mouseY.set(y)
      }
    }

    window.addEventListener("mousemove", handleMouseMove)

    // Sequence the animations
    const contentTimer = setTimeout(() => {
      setShowContent(true)
    }, 500)

    // Start particle animation after initial text animation
    const particleTimer = setTimeout(() => {
      setShowParticles(true)

      // Start the grid animation
      gridControls.start({
        opacity: 0.15,
        transition: { duration: 2 },
      })
    }, 1200)

    // Auto-dismiss after 7.5 seconds
    const exitTimer = setTimeout(() => {
      setExitSplash(true)
    }, 7500)

    return () => {
      clearTimeout(contentTimer)
      clearTimeout(particleTimer)
      clearTimeout(exitTimer)
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [mouseX, mouseY, gridControls])

  // Create transforms for parallax effects
  const rotateX = useTransform(mouseY, [0, 1000], [5, -5])
  const rotateY = useTransform(mouseX, [0, 1000], [-5, 5])
  const backgroundX = useTransform(mouseX, [0, 1000], [50, 40])
  const backgroundY = useTransform(mouseY, [0, 1000], [50, 40])

  return (
    <AnimatePresence mode="wait">
      {!exitSplash && (
        <motion.div
          ref={containerRef}
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden perspective-1000"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5 } }}
          style={{
            background: "linear-gradient(135deg, #051937, #004d7a, #008793, #00bf72, #a8eb12)",
            backgroundSize: "400% 400%",
          }}
        >
          {/* Animated background with gradient movement */}
          <motion.div
            className="absolute inset-0 z-0"
            animate={{
              backgroundPosition: ["0% 0%", "100% 100%"],
            }}
            transition={{
              duration: 15,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              ease: "linear",
            }}
            style={{
              background: "linear-gradient(135deg, #051937, #004d7a, #008793, #00bf72, #a8eb12)",
              backgroundSize: "400% 400%",
            }}
          />

          {/* Tech grid overlay */}
          <motion.div
            className="absolute inset-0 z-0"
            initial={{ opacity: 0 }}
            animate={gridControls}
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
              `,
              backgroundSize: "50px 50px",
              backgroundPosition: `${backgroundX}px ${backgroundY}px`,
            }}
          />

          {/* Digital circuit patterns */}
          <motion.div
            className="absolute inset-0 z-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 10 H 90 V 90 H 10 L 10 10' stroke='white' fill='none' strokeWidth='1'/%3E%3Cpath d='M30 30 H 70 V 70 H 30 L 30 30' stroke='white' fill='none' strokeWidth='1'/%3E%3Cpath d='M10 50 H 30' stroke='white' fill='none' strokeWidth='1'/%3E%3Cpath d='M70 50 H 90' stroke='white' fill='none' strokeWidth='1'/%3E%3Cpath d='M50 10 V 30' stroke='white' fill='none' strokeWidth='1'/%3E%3Cpath d='M50 70 V 90' stroke='white' fill='none' strokeWidth='1'/%3E%3C/svg%3E")`,
              backgroundSize: "100px 100px",
            }}
            animate={{
              backgroundPosition: ["0px 0px", "100px 100px"],
            }}
            transition={{
              duration: 20,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />

          {/* Animated pulsing circles background */}
          <motion.div
            className="absolute w-full h-full overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ duration: 2 }}
          >
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-500/20"
              initial={{ scale: 0 }}
              animate={{
                scale: [0, 15, 12, 18],
                opacity: [0, 0.3, 0.2, 0.4],
              }}
              transition={{
                duration: 6,
                times: [0, 0.4, 0.7, 1],
                ease: "easeInOut",
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            />
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/20"
              initial={{ scale: 0 }}
              animate={{
                scale: [0, 10, 8, 12],
                opacity: [0, 0.2, 0.1, 0.3],
              }}
              transition={{
                duration: 5,
                times: [0, 0.4, 0.7, 1],
                ease: "easeInOut",
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                delay: 0.5,
              }}
            />
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/20"
              initial={{ scale: 0 }}
              animate={{
                scale: [0, 20, 15, 25],
                opacity: [0, 0.1, 0.05, 0.2],
              }}
              transition={{
                duration: 7,
                times: [0, 0.4, 0.7, 1],
                ease: "easeInOut",
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                delay: 1,
              }}
            />
          </motion.div>

          {/* Floating code snippets */}
          {showParticles && (
            <>
              {codeSnippets.map((snippet, i) => {
                const x = (i % 5) * 20
                const y = Math.floor(i / 5) * 20
                const duration = Math.random() * 20 + 15
                const delay = Math.random() * 2

                return (
                  <motion.div
                    key={`code-${i}`}
                    className="absolute text-xs md:text-sm font-mono text-white/40 whitespace-nowrap"
                    initial={{
                      opacity: 0,
                      x: `${x}vw`,
                      y: `${y + 100}vh`,
                    }}
                    animate={{
                      opacity: [0, 0.7, 0.5, 0],
                      x: `${x}vw`,
                      y: [`${y + 100}vh`, `${y - 20}vh`],
                    }}
                    transition={{
                      duration: duration,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: delay,
                    }}
                  >
                    {snippet}
                  </motion.div>
                )
              })}
            </>
          )}

          {/* Animated medical and tech icons */}
          {showParticles && (
            <>
              {[...Array(30)].map((_, i) => {
                const icons = [
                  <Bot key="bot" className="text-teal-400" />,
                  <Activity key="activity" className="text-blue-400" />,
                  <Brain key="brain" className="text-purple-400" />,
                  <HeartPulse key="heart" className="text-red-400" />,
                  <Dna key="dna" className="text-green-400" />,
                  <Stethoscope key="stethoscope" className="text-yellow-400" />,
                  <Microscope key="microscope" className="text-indigo-400" />,
                  <Sparkles key="sparkles" className="text-pink-400" />,
                  <Code key="code" className="text-cyan-400" />,
                  <Cpu key="cpu" className="text-orange-400" />,
                  <Wifi key="wifi" className="text-lime-400" />,
                  <Database key="database" className="text-amber-400" />,
                  <Server key="server" className="text-fuchsia-400" />,
                  <Layers key="layers" className="text-rose-400" />,
                ]

                const randomIcon = icons[Math.floor(Math.random() * icons.length)]
                const size = Math.random() * 30 + 10
                const x = Math.random() * 100
                const y = Math.random() * 100
                const duration = Math.random() * 20 + 10
                const delay = Math.random() * 2

                return (
                  <motion.div
                    key={i}
                    className="absolute opacity-30"
                    initial={{ scale: 0, x: `${x}vw`, y: `${y}vh` }}
                    animate={{
                      scale: [0, 1, 0.8, 1],
                      x: [`${x}vw`, `${x + (Math.random() * 20 - 10)}vw`],
                      y: [`${y}vh`, `${y + (Math.random() * 20 - 10)}vh`],
                      rotate: [0, 360],
                    }}
                    transition={{
                      duration: duration,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "reverse",
                      delay: delay,
                    }}
                    style={{ width: size, height: size }}
                  >
                    {randomIcon}
                  </motion.div>
                )
              })}
            </>
          )}

          {/* Binary particles */}
          {showParticles && (
            <>
              {[...Array(40)].map((_, i) => {
                const binary = Math.random() > 0.5 ? "1" : "0"
                const size = Math.random() * 14 + 8
                const x = Math.random() * 100
                const y = Math.random() * 100
                const duration = Math.random() * 15 + 10
                const delay = Math.random() * 3

                return (
                  <motion.div
                    key={`binary-${i}`}
                    className="absolute font-mono text-white/30 font-bold"
                    initial={{ opacity: 0, x: `${x}vw`, y: `${y}vh`, scale: 0 }}
                    animate={{
                      opacity: [0, 0.3, 0.5, 0],
                      scale: [0, 1, 1.2, 0],
                      x: [`${x}vw`, `${x + (Math.random() * 10 - 5)}vw`],
                      y: [`${y}vh`, `${y + (Math.random() * 10 - 5)}vh`],
                    }}
                    transition={{
                      duration: duration,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "reverse",
                      delay: delay,
                    }}
                    style={{ fontSize: size }}
                  >
                    {binary}
                  </motion.div>
                )
              })}
            </>
          )}

          {/* Main content container with 3D effect */}
          <motion.div
            className="relative z-10 max-w-4xl px-6 text-center"
            style={{
              rotateX: rotateX,
              rotateY: rotateY,
              transformStyle: "preserve-3d",
            }}
          >
            {/* DNA helix animation at the top */}
            <motion.div
              className="mb-6 flex justify-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              <motion.div
                animate={{
                  rotateY: [0, 360],
                }}
                transition={{
                  duration: 10,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <Dna className="h-16 w-16 text-teal-400 drop-shadow-[0_0_15px_rgba(20,184,166,0.7)]" />
              </motion.div>
            </motion.div>

            {/* Main title with typing effect */}
            <motion.div
              className="mb-8 overflow-hidden"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.h1
                className={`${playfair.className} text-4xl md:text-5xl font-bold text-white mb-2 leading-tight drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5 }}
              >
                <motion.span
                  className="inline-block bg-gradient-to-r from-teal-300 to-blue-300 bg-clip-text text-transparent"
                  initial={{ y: 20 }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                >
                  AI-Based Healthcare Chatbot
                </motion.span>
                <br />
                <motion.span
                  className="inline-block text-white"
                  initial={{ y: 20 }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  for Complete Diagnosis
                </motion.span>
              </motion.h1>
              <motion.div
                className="h-1 w-32 bg-gradient-to-r from-teal-400 to-blue-400 mx-auto rounded-full"
                initial={{ width: 0 }}
                animate={{ width: "8rem" }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </motion.div>

            {/* Team members with staggered animation */}
            <motion.div
              className="mb-8"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              <motion.h2
                className={`${playfair.className} text-xl font-semibold text-blue-200 mb-4`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                Developed By
              </motion.h2>
              <div className="flex flex-col md:flex-row justify-center gap-3 md:gap-6">
                {[
                  { name: "Soumodip Ghosh", id: "21BEC0232", delay: 1.3 },
                  { name: "Soumya Gupta", id: "21BML0134", delay: 1.5 },
                  { name: "Aleesha T Saju", id: "21BML0069", delay: 1.7 },
                ].map((member, index) => (
                  <motion.div
                    key={index}
                    className="bg-white/10 backdrop-blur-sm px-4 py-3 rounded-lg border border-white/20"
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: member.delay, duration: 0.5 }}
                    whileHover={{
                      scale: 1.05,
                      backgroundColor: "rgba(255, 255, 255, 0.15)",
                      boxShadow: "0 0 20px rgba(56, 189, 248, 0.3)",
                    }}
                  >
                    <p className="text-white font-medium">{member.name}</p>
                    <p className="text-blue-200 text-sm">{member.id}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Supervisor with fade-in animation */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 2 }}
            >
              <motion.p
                className={`${playfair.className} text-lg text-teal-200`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.2 }}
              >
                Under the supervision of
              </motion.p>
              <motion.div
                className="inline-block mt-1 px-6 py-2 bg-gradient-to-r from-teal-500/20 to-blue-500/20 rounded-full backdrop-blur-sm border border-teal-500/30"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 2.4, duration: 0.5 }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 25px rgba(20, 184, 166, 0.4)",
                }}
              >
                <p className={`${playfair.className} text-xl font-semibold text-white`}>Bijayalaxmi Maam</p>
              </motion.div>
            </motion.div>

            {/* Tech elements and loading indicator at the bottom */}
            <motion.div
              className="absolute bottom-8 left-0 right-0 flex items-center justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 3, duration: 0.8 }}
            >
              <motion.div
                className="px-6 py-2 bg-white/5 backdrop-blur-md rounded-full text-sm text-blue-100 flex items-center"
                animate={{
                  y: [0, -5, 0],
                  boxShadow: [
                    "0 0 0 rgba(56, 189, 248, 0)",
                    "0 0 20px rgba(56, 189, 248, 0.3)",
                    "0 0 0 rgba(56, 189, 248, 0)",
                  ],
                }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "loop",
                }}
              >
              </motion.div>
            </motion.div>
          </motion.div>
          {/* Loading indicator at the absolute bottom */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 pb-4 flex flex-col items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.8 }}
          >
            <div className="flex justify-center items-center space-x-3">
              {[0, 1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className="w-3 h-3 rounded-full bg-teal-400 shadow-[0_0_10px_rgba(20,184,166,0.7)]"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.7, 1, 0.7],
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "loop",
                    delay: i * 0.2,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>
            <motion.p
              className={`${playfair.className} text-blue-200 mt-3 font-medium`}
              animate={{
                opacity: [0.5, 1, 0.5],
                y: [0, -3, 0],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
              }}
            >
              Initializing healthcare system...
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
