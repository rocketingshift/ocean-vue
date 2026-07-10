import { ref, onUnmounted } from 'vue'
import { PATHS } from '@/config/assets'

export function useAudio() {
  const isPlaying = ref(false)
  const isMuted   = ref(true)  // mặc định mute (browser autoplay policy)
  let   _audio    = null

  function _ensure() {
    if (_audio) return
    _audio         = new Audio(PATHS.audio.sfx)
    _audio.loop    = true
    _audio.volume  = 0.35
    _audio.muted   = isMuted.value
  }

  function play() {
    _ensure()
    _audio.play().catch(() => {})
    isPlaying.value = true
  }

  function pause() {
    _audio?.pause()
    isPlaying.value = false
  }

  function toggleMute() {
    _ensure()
    isMuted.value = !isMuted.value
    _audio.muted  = isMuted.value
  }

  function setVolume(v) {
    _ensure()
    _audio.volume = Math.min(1, Math.max(0, v))
  }

  onUnmounted(() => { pause(); _audio = null })

  return { isPlaying, isMuted, play, pause, toggleMute, setVolume }
}
