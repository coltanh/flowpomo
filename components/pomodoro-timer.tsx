'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Settings, Bell } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const themes = {
  default: {
    background: 'from-blue-100 to-purple-100',
    darkBackground: 'dark:from-blue-900 dark:to-purple-900',
    ring: 'text-blue-500',
    darkRing: 'dark:text-blue-400',
  },
  sunset: {
    background: 'from-orange-100 to-red-100',
    darkBackground: 'dark:from-orange-900 dark:to-red-900',
    ring: 'text-orange-500',
    darkRing: 'dark:text-orange-400',
  },
  forest: {
    background: 'from-green-100 to-emerald-100',
    darkBackground: 'dark:from-green-900 dark:to-emerald-900',
    ring: 'text-green-500',
    darkRing: 'dark:text-green-400',
  },
  ocean: {
    background: 'from-cyan-100 to-blue-100',
    darkBackground: 'dark:from-cyan-900 dark:to-blue-900',
    ring: 'text-cyan-500',
    darkRing: 'dark:text-cyan-400',
  },
  monochrome: {
    background: 'from-gray-100 to-gray-200',
    darkBackground: 'dark:from-gray-900 dark:to-gray-800',
    ring: 'text-gray-600',
    darkRing: 'dark:text-gray-400',
  },
} as const

type ThemeKey = keyof typeof themes

export default function PomodoroTimer() {
  const [isWorking, setIsWorking] = useState(true)
  const [workDuration, setWorkDuration] = useState(25)
  const [breakDuration, setBreakDuration] = useState(5)
  const [timeLeft, setTimeLeft] = useState(workDuration * 60)
  const [isActive, setIsActive] = useState(false)
  const [progress, setProgress] = useState(100)
  const [theme, setTheme] = useState<ThemeKey>('default')
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [showNotification, setShowNotification] = useState(false)

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1)
        setProgress((prevProgress) => 
          Number((prevProgress - 100 / (isWorking ? workDuration * 60 : breakDuration * 60)).toFixed(2))
        )
      }, 1000)
    } else if (timeLeft === 0) {
      setIsWorking((prev) => !prev)
      setTimeLeft(isWorking ? breakDuration * 60 : workDuration * 60)
      setProgress(100)
      setShowNotification(true)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, timeLeft, isWorking, workDuration, breakDuration])

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => {
        setShowNotification(false)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [showNotification])

  const toggleTimer = () => setIsActive(!isActive)

  const resetTimer = () => {
    setIsActive(false)
    setTimeLeft(isWorking ? workDuration * 60 : breakDuration * 60)
    setProgress(100)
  }

  const toggleMode = () => {
    setIsWorking((prev) => !prev)
    setTimeLeft(isWorking ? breakDuration * 60 : workDuration * 60)
    setProgress(100)
    setIsActive(false)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleWorkDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value)
    if (!isNaN(value) && value > 0) {
      setWorkDuration(value)
      if (isWorking) {
        setTimeLeft(value * 60)
        setProgress(100)
      }
    }
  }

  const handleBreakDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value)
    if (!isNaN(value) && value > 0) {
      setBreakDuration(value)
      if (!isWorking) {
        setTimeLeft(value * 60)
        setProgress(100)
      }
    }
  }

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen bg-gradient-to-br ${themes[theme].background} ${themes[theme].darkBackground} transition-colors duration-300 p-4`}>
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 max-w-md w-full relative transition-colors duration-300">
        <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="absolute top-4 right-4">
              <Settings className="h-4 w-4" />
              <span className="sr-only">Settings</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white dark:bg-gray-800 dark:text-white">
            <DialogHeader>
              <DialogTitle>Settings</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="work-duration" className="text-gray-600 dark:text-gray-200">
                    Work Duration (min)
                  </Label>
                  <Input
                    id="work-duration"
                    type="number"
                    value={workDuration}
                    onChange={handleWorkDurationChange}
                    min="1"
                    className="w-full bg-white dark:bg-gray-700 dark:text-white border-gray-200"
                  />
                </div>
                <div>
                  <Label htmlFor="break-duration" className="text-gray-600 dark:text-gray-200">
                    Break Duration (min)
                  </Label>
                  <Input
                    id="break-duration"
                    type="number"
                    value={breakDuration}
                    onChange={handleBreakDurationChange}
                    min="1"
                    className="w-full bg-white dark:bg-gray-700 dark:text-white border-gray-200"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="theme-select" className="block mb-2 text-sm font-medium">
                  Theme
                </Label>
                <Select onValueChange={(value: ThemeKey) => setTheme(value)} value={theme}>
                  <SelectTrigger 
                    id="theme-select" 
                    className="bg-white dark:bg-gray-700 dark:text-white border-gray-200"
                  >
                    <SelectValue placeholder="Select a theme" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-700 dark:text-white border border-gray-200">
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="sunset">Sunset</SelectItem>
                    <SelectItem value="forest">Forest</SelectItem>
                    <SelectItem value="ocean">Ocean</SelectItem>
                    <SelectItem value="monochrome">Monochrome</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-center gap-4">
                <Label htmlFor="dark-mode-toggle" className="text-sm font-medium">
                  Dark Mode
                </Label>
                <Switch
                  id="dark-mode-toggle"
                  checked={isDarkMode}
                  onCheckedChange={setIsDarkMode}
                />
              </div>
            </div>
          </DialogContent>
        </Dialog>
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-white">FlowPomo</h1>
        <div className="relative w-64 h-64 mx-auto mb-8">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle
              className="text-gray-200 dark:text-gray-700 stroke-current"
              strokeWidth="5"
              cx="50"
              cy="50"
              r="45"
              fill="transparent"
            />
            <circle
              className={`${themes[theme].ring} ${themes[theme].darkRing} stroke-current`}
              strokeWidth="5"
              strokeLinecap="round"
              cx="50"
              cy="50"
              r="45"
              fill="transparent"
              strokeDasharray="283"
              strokeDashoffset={283 - (283 * progress) / 100}
              style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
            />
          </svg>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <p className="text-4xl font-bold text-gray-800 dark:text-white">{formatTime(timeLeft)}</p>
            <p className="text-lg text-gray-600 dark:text-gray-300">{isWorking ? 'Work' : 'Break'}</p>
          </div>
        </div>
        <div className="flex justify-center space-x-4 mb-6">
          <Button 
            onClick={toggleTimer} 
            className="w-24 bg-black text-white hover:bg-gray-900"
          >
            {isActive ? 'Pause' : 'Start'}
          </Button>
          <Button 
            onClick={resetTimer} 
            variant="outline" 
            className="w-24 bg-white text-black border border-gray-200 hover:bg-gray-50"
          >
            Reset
          </Button>
        </div>
        <div className="flex items-center justify-center space-x-2">
          <Label htmlFor="mode-toggle" className="text-gray-800 dark:text-white">Work</Label>
          <Switch
            id="mode-toggle"
            checked={!isWorking}
            onCheckedChange={toggleMode}
            className="bg-gray-300 dark:bg-gray-600"
          />
          <Label htmlFor="mode-toggle" className="text-gray-800 dark:text-white">Break</Label>
        </div>
      </div>
      {showNotification && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 text-gray-800 dark:text-white px-4 py-2 rounded-full shadow-lg transition-all duration-300 ease-in-out animate-fade-in-up">
          <div className="flex items-center">
            <Bell className="mr-2 h-4 w-4" />
            <span className="font-medium">{isWorking ? 'Break time!' : 'Time to work!'}</span>
          </div>
        </div>
      )}
    </div>
  )
}