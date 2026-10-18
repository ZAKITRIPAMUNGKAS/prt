export interface LyricLine {
  time: number; // in seconds
  text: string;
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  src: string;
  cover: string;
  lyrics?: string | null;
}

export function parseLrc(lrcText?: string | null): LyricLine[] {
  if (!lrcText) return [];
  const lines = lrcText.split("\n");
  const result: LyricLine[] = [];
  const timeRegex = /\[(\d{1,2}):(\d{2})(?:\.(\d{1,3}))?\]/;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;
    const match = line.match(timeRegex);
    if (match) {
      const minutes = parseInt(match[1], 10);
      const seconds = parseInt(match[2], 10);
      const milliseconds = match[3] ? parseInt(match[3].padEnd(3, "0").slice(0, 3), 10) : 0;
      const totalSeconds = minutes * 60 + seconds + milliseconds / 1000;
      const text = line.replace(timeRegex, "").trim();
      if (text) {
        result.push({ time: totalSeconds, text });
      }
    } else if (line.length > 0) {
      result.push({ time: result.length * 4, text: line });
    }
  }

  return result.sort((a, b) => a.time - b.time);
}

export const defaultPlaylist: Track[] = [
  {
    id: "1",
    title: "Sway",
    artist: "Colorcode • Wong Kalahan",
    src: "/music/colorcode-sway.mp3",
    cover: "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800&auto=format&fit=crop&q=80",
    lyrics: `[00:02.59] And I’m still screaming out your name
[00:09.21] Like you never really went away
[00:16.00] Every night wishing you would feel the same
[00:22.59] Every night I lie awake
[00:28.09] (Instrumental Break)
[00:47.50] If day could take me back to you
[00:51.88] I’d run through everything I knew
[00:59.02] But all I have is just this empty room`,
  },
  {
    id: "2",
    title: "Trauma Response",
    artist: "Colorcode • Wong Kalahan",
    src: "/music/colorcode-trauma-response.mp3",
    cover: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80",
    lyrics: `[00:00.73] Now I'm stuck inside a life I didn't choose to live
[00:05.03] All my fucking energy spent on something and you won't give
[00:09.93] So I tried and tried to paint you something out of my ways
[00:15.01] I gave you all my time just to fill up your goddamn space
[00:19.35] But still I tried and tried to paint you something out of my ways
[00:24.68] I gave you all my time just to fill up your goddamn space
[00:30.90] ("Listen.")
[00:32.48] I'm tired of making you a lesson
[00:35.59] ("Enough.")
[00:35.75] The static is seeping into my eardrum
[00:40.65] ("Listen.")
[00:42.59] I'm tired of making you a lesson
[00:45.85] ("Enough.")
[00:47.42] The static is seeping into my eardrum
[00:55.79] Now you switched your old jersey clean
[00:58.16] For a brand new cologne`,
  },
  {
    id: "3",
    title: "Submerge",
    artist: "Colorcode • Wong Kalahan",
    src: "/music/colorcode-submerge.mp3",
    cover: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80",
    lyrics: `[00:02.84] I accept all of this as the art of letting go
[00:08.07] Everything has been arranged at the end of life
[00:12.17] I was awakened to how I should act with you
[00:18.17] Spending these final seconds together with you, too
[00:23.02] At the end of the story
[00:25.04] The All-Forgiving will surely erase our sins
[00:30.72] At that time I was far away, in another city and another island
[00:37.37] While you were inside a building you despised
[00:41.91] Me, you, and medical hand
[00:45.76] Beside you, where your body was resting, you held my finger
[00:50.58] You were afraid to be even a step away from me`,
  },
  {
    id: "4",
    title: "Better Off This Way",
    artist: "Summerlane • Wong Kalahan",
    src: "/music/summerlane-better-off-this-way.mp3",
    cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&auto=format&fit=crop&q=80",
    lyrics: `[00:02.05] You left me nothing but misery
[00:07.88] I'm leaving it all behind
[00:11.13] (Maybe we are better off this way)
[00:14.25] I'll shut the door for you in hurry
[00:19.97] I'm trying to ease my mind
[00:23.22] (Maybe we are better off this way)
[00:29.15] Cross my heart and hope to die
[00:32.05] I'm so fed up with all your lies
[00:35.34] Well, I will get over the fact that we're not meant to be
[00:42.09] You know it's so hard for my eyes to see
[00:45.34] Once I was tied but now I'm finally free
[00:48.09] We know what we are, but we don't know what we maybe
[00:54.13] We know what we are, but we don't know what we maybe
[00:59.75] You left me nothing but misery`,
  },
  {
    id: "5",
    title: "Color Blind",
    artist: "Summerlane • Wong Kalahan",
    src: "/music/summerlane-color-blind.mp3",
    cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80",
    lyrics: `[00:00.00] The clock's ticking, we're not dreaming
[00:05.50] You don't have to go, but you don't have to stay
[00:11.20] But at least we can save ourselves from falling
[00:17.80] Don't see this world in black and white
[00:23.20] 'Cause I know you're not colorblind
[00:28.50] Oh dear, we got no place to hide
[00:33.80] Now I refuse to press rewind
[00:39.50] Here we go again, tell me you'll stay
[00:45.20] We will figure out a way
[00:51.00] I'll take you anywhere you want to go`,
  },
  {
    id: "6",
    title: "Calm Down",
    artist: "Morscode • Wong Kalahan",
    src: "/music/morscode-calm-down.mp3",
    cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80",
    lyrics: `[00:00.00] (Calm Down • Morscode)
[00:10.00] Lost inside the noise and haze
[00:22.00] Counting all these passing days
[00:35.00] Won't you please just calm down
[00:48.00] (Instrumental Outro)`,
  },
  {
    id: "7",
    title: "Rumit",
    artist: "Rocket Rockers ft. Rizky Irmansyah • Wong Kalahan",
    src: "/music/rocket-rockers-rumit.mp3",
    cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80",
    lyrics: `[00:00.00] Memahami hatimu...
[00:04.50] Tak akan cukup usiaku
[00:09.20] Sementara rindu ini semakin menusuk dadaku
[00:16.50] Ternyata perasaanmu padaku biasa-biasa saja
[00:24.00] Cinta itu sederhana, yang rumit itu kamu
[00:33.00] Mencintaimu itu mudah
[00:38.20] Yang sulit adalah membuatmu juga mencintaiku
[00:46.50] Aku mengerti bahwa bahagiamu bukan denganku
[00:52.50] Niscaya semua luka kan sembuh bersama waktu`,
  },
  {
    id: "8",
    title: "Kau Si Lagu Sedih",
    artist: "Dongker • Wong Kalahan",
    src: "/music/dongker-kau-si-lagu-sedih.mp3",
    cover: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80",
    lyrics: `[00:00.38] Kukira hatiku sekeras batu
[00:03.16] Lantas hancur tak bersisa
[00:05.93] Kukira dunia penuh harap
[00:09.01] Lantas kau tak ada
[00:11.86] Kau selalu terlihat indah
[00:15.61] Meski telah hilang
[00:18.67] Lihatlah
[00:20.12] Langit runtuh menunjukkan luka
[00:24.27] Dunia
[00:26.08] Menyerang dan membabi buta
[00:29.90] Tapi aku terus hidup
[00:35.40] (Instrumental Break)
[00:49.77] Jika hidup tentang uang, untuk apa semua cinta?
[00:52.51] Musuh abadi dan teman abadi
[00:55.63] Jika cinta sudah dibuang
[00:58.41] Jangan harap keadilan akan datang`,
  },
  {
    id: "9",
    title: "Sports Between Trenches",
    artist: "Murphy Radio • Wong Kalahan",
    src: "/music/murphy-radio-sports-between-trenches.mp3",
    cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80",
    lyrics: `[00:00.00] (Math Rock Instrumental)
[00:15.00] Murphy Radio • Samarinda
[00:30.00] Sports Between Trenches
[00:45.00] (Melodic Riff Climax)`,
  },
  {
    id: "10",
    title: "December",
    artist: "Neck Deep • Wong Kalahan",
    src: "/music/neck-deep-december.mp3",
    cover: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80",
    lyrics: `[00:02.74] I wonder if you'll ever hear this song on your stereo
[00:08.69] I hope you get your ballroom floor
[00:11.82] Your perfect house with rose red doors
[00:15.24] I'm the last thing you'd remember
[00:18.58] It's been a long, lonely December
[00:21.95] I wish I'd known that less is more
[00:25.03] But I was passed out on the floor
[00:28.43] And that's the last thing I remember
[00:31.88] It's been a long, lonely December
[00:34.85] Cast me aside to show yourself in a better light
[00:39.65] I came out grieving, barely breathing, and you came out alright
[00:46.67] But I'm sure you'll take his hand
[00:49.82] I hope he's better than I ever could've been
[00:53.31] My mistakes were not intentions
[00:56.71] This is a list of my confessions I couldn't say`,
  },
  {
    id: "11",
    title: "A Part of Me",
    artist: "Neck Deep • Wong Kalahan",
    src: "/music/neck-deep-a-part-of-me.mp3",
    cover: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&auto=format&fit=crop&q=80",
    lyrics: `[00:02.32] We could never see eye to eye
[00:05.47] But either way
[00:06.90] I like her 'cause she's smart
[00:09.06] Headstrong and independent
[00:11.95] She puts me in my place
[00:14.35] But I don't know where I stand
[00:17.17] And if only I could find the words
[00:18.88] Or muster up the nerve to tell her
[00:21.55] I'll never forget her
[00:22.48] And she'll always have a part of me
[00:25.87] Don't let me go down this road again
[00:31.58] We both know where this ends
[00:35.43] In a storm of feeling
[00:37.13] I'm so unappealing
[00:40.68] I can't play these games
[00:42.86] I like her 'cause she's smart
[00:45.13] Headstrong and independent
[00:47.88] She puts me in my place
[00:50.12] But I don't know where I stand
[00:52.17] And if only I could find the words
[00:55.21] Or muster up the nerve to tell her
[00:57.48] I'll never forget her
[00:58.24] And she'll always have a part of me
[00:59.56] I like her 'cause she's smart`,
  },
  {
    id: "12",
    title: "Late Nights in My Car",
    artist: "Real Friends • Wong Kalahan",
    src: "/music/real-friends-late-nights-in-my-car.mp3",
    cover: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800&auto=format&fit=crop&q=80",
    lyrics: `[00:04.16] I'll blame the midwest and sleepy eyes
[00:09.95] I'm not where I should be
[00:11.66] I'm not what I could be
[00:15.38] But I'm not who I was
[00:20.12] Nostalgia gets the best of me
[00:22.53] When I wake up it's the same day
[00:25.74] It fucks me up and makes me miss who I used to be
[00:30.58] All I have are thoughts of me from back when I was 18 and my bony knees
[00:36.08] (Instrumental Break)
[00:56.94] Don't want it to be like my teenage years`,
  },
  {
    id: "13",
    title: "I've Given Up on You",
    artist: "Real Friends • Wong Kalahan",
    src: "/music/real-friends-ive-given-up-on-you.mp3",
    cover: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=80",
    lyrics: `[00:02.03] I write songs about you all the time
[00:06.71] I bet I don't run through your mind
[00:13.22] I've given up on you
[00:16.79] But it still hurts to know you're not alone
[00:20.57] Don't worry
[00:23.76] I'll keep out of your life and stay awake at night
[00:29.26] (Instrumental Break)
[00:33.05] It's 4:00 a.m. and you're keeping me from closing these sleepy eyes
[00:39.21] Does the thought of me keep you up at night?
[00:43.85] Like the light on the ceiling of your bedroom
[00:47.91] Lately
[00:49.29] My dog's the only one around that listens to my problems
[00:57.17] It's been a lonely year`,
  },
  {
    id: "14",
    title: "Secrets",
    artist: "State Champs • Wong Kalahan",
    src: "/music/state-champs-secrets.mp3",
    cover: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=800&auto=format&fit=crop&q=80",
    lyrics: `[00:02.73] 'Cause I dropped my forgiveness
[00:04.94] It's lying face-down on the floor
[00:08.34] I've got more secrets than you'll ever know
[00:12.11] Another year and you won't let it go
[00:16.66] Too many times I told myself to hold on
[00:21.28] But it's too late for me, now I'm as good as gone
[00:27.76] Funny how we go way back and we said that
[00:30.09] We wouldn't let this come between
[00:32.48] Everything and is it true that I could look past
[00:34.65] Memories and stay obscene?
[00:37.08] Oh, your idea of me blown away, away
[00:41.64] Something's telling me I never
[00:42.92] Could have ruined everything you want in life
[00:46.12] 'Cause you never put in the effort, and the truth is
[00:48.38] You were never doing it right
[00:50.67] Oh, you're making me sick, what is this?
[00:54.14] Am I the one you can't ignore?
[00:58.76] 'Cause I dropped my forgiveness`,
  },
  {
    id: "15",
    title: "Sway",
    artist: "Bearings • Wong Kalahan",
    src: "/music/bearings-sway.mp3",
    cover: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&auto=format&fit=crop&q=80",
    lyrics: `[00:01.82] We turn it into nothing
[00:05.02] Sway (you're swimming in my veins)
[00:08.05] Around your room (and it's not the same without you)
[00:12.12] To something blue
[00:13.06] She bases what she's drinking on the place and time of day
[00:17.00] Says that she loves California but she hates LA, okay
[00:22.50] (Instrumental Break)
[00:29.49] You don't talk about your thoughts now, so your mind is mine to read
[00:33.55] I've got something in me twisting up, screaming time is all I need
[00:38.58] What you think about a conversation? What you think about a different line?
[00:42.59] What you think about me and you? I lost track of time
[00:45.45] We take something
[00:47.34] We're always taking something
[00:49.45] And turn it into nothing
[00:51.34] We turn it into nothing
[00:54.54] Sway (you're swimming in my veins)
[00:57.68] Around your room (and it's not the same without you)`,
  },
  {
    id: "16",
    title: "Miserable at Best",
    artist: "Mayday Parade • Wong Kalahan",
    src: "/music/mayday-parade-miserable-at-best.mp3",
    cover: "https://images.unsplash.com/photo-1520523839898-50712213388b?w=800&auto=format&fit=crop&q=80",
    lyrics: `[00:02.00] And ask my girl to dance, she'll say yes
[00:10.07] Because these words were never easier for me to say
[00:16.07] Or her to second-guess, but I guess
[00:24.67] That I can live without you, but
[00:28.77] Without you, I'll be miserable at best
[00:34.03] You're all that I hoped I'd find in every single way
[00:41.10] And everything I would give is everything you couldn't take
[00:48.23] 'Cause nothing feels like home, you're a thousand miles away
[00:55.10] And the hardest part of living is just taking breaths to stay`,
  },
  {
    id: "17",
    title: "Things I Can't Change",
    artist: "The Story So Far • Wong Kalahan",
    src: "/music/the-story-so-far-things-i-cant-change.mp3",
    cover: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800&auto=format&fit=crop&q=80",
    lyrics: `[00:01.24] And now I'm gone
[00:03.02] Lie alone, it's all you can do now
[00:09.29] And hear me drone about the things I can't change
[00:13.35] Lie alone, it's all you can do now
[00:17.12] And hear me, hear me drone on my own
[00:25.02] What has this come to?
[00:26.64] I know you don't see me as much you ought to
[00:31.18] And both wounds are bleeding out
[00:32.84] Grace me with nothing but patience
[00:36.58] I'll admit that I hate this if there's no other way out
[00:42.85] There's no other way out
[00:48.44] Lie alone, it's all you can do now
[00:52.39] And hear me drone about the things I can't change
[00:56.29] Lie alone, it's all you can do now`,
  },
  {
    id: "18",
    title: "Pretense",
    artist: "Knuckle Puck • Wong Kalahan",
    src: "/music/knuckle-puck-pretense.mp3",
    cover: "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800&auto=format&fit=crop&q=80",
    lyrics: `[00:03.23] I will not follow in your footsteps
[00:06.59] I'll find a face to call my own
[00:10.12] Because the mask you wear is all I've ever known
[00:13.66] Consider this a repercussion of the actions which you were never properly punished for
[00:19.36] Due to an overbearing demeanor brought on by your own self-awareness
[00:23.67] Your credibility is a half-empty glass of salt water
[00:27.32] That I watched you spill over and over and over again
[00:30.96] Go ahead, make me the bad guy
[00:34.03] How dare you guilt me for not sticking around
[00:38.13] As if you ever did for me?
[00:44.14] I'll leave you in the dark with a broken flashlight
[00:49.00] You left me with a choice and a pretense`,
  },
  {
    id: "19",
    title: "Came Out Swinging",
    artist: "The Wonder Years • Wong Kalahan",
    src: "/music/the-wonder-years-came-out-swinging.mp3",
    cover: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&auto=format&fit=crop&q=80",
    lyrics: `[00:00.85] I'm just so tired
[00:02.77] I spent this year as a ghost and I'm not sure what I'm looking for
[00:08.18] I'm a voice on a phone that you rarely answer anymore
[00:12.71] I came in here alone
[00:13.94] Came in here alone
[00:15.22] But that doesn't scare me like it did seven months ago
[00:16.97] I spent this year as a ghost and I'm not sure where home is anymore
[00:22.47] (Instrumental Break)
[00:30.71] Been on a steady fast food diet
[00:33.14] Like we're this generation's Morgan Spurlock
[00:38.14] But we don't admit defeat
[00:40.31] My body feels rejected, I can't say that I blame it
[00:44.96] My heart keeps saying stay young
[00:47.44] My lower back seems to disagree
[00:50.51] I unrolled a cheap cotton blanket on an old dirty couch
[00:57.12] I felt the year start to wind down`,
  },
  {
    id: "20",
    title: "Therapy",
    artist: "All Time Low • Wong Kalahan",
    src: "/music/all-time-low-therapy.mp3",
    cover: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=80",
    lyrics: `[00:03.16] Give me therapy
[00:06.74] I'm a walking travesty
[00:12.16] But I'm smiling at everything
[00:15.71] Therapy, you were never a friend to me
[00:23.47] You can keep all your misery
[00:28.97] (Instrumental Break)
[00:38.08] My lungs gave out
[00:40.86] As I faced the crowd
[00:43.35] I think that keeping this up could be dangerous
[00:49.23] I'm flesh and bone
[00:51.84] I'm a rolling stone
[00:55.00] And the experts say I'm delirious
[00:59.68] Give me therapy`,
  },
];
