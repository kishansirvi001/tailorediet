const VALID_FITNESS_LEVELS = ["beginner", "intermediate", "advanced"];
const VALID_EXERCISE_COUNTS = [6, 8, 10];

const GOAL_DETAILS = {
  "muscle-gain": {
    label: "Muscle Gain",
    summary:
      "Prioritizes higher training volume, moderate rest, and enough accessory work to support hypertrophy without making the split chaotic.",
  },
  "fat-loss": {
    label: "Fat Loss",
    summary:
      "Keeps the week strength-focused while layering in denser training blocks and conditioning so the plan supports calorie burn and muscle retention.",
  },
  strength: {
    label: "Strength",
    summary:
      "Centers the week around heavier compound work, longer rest on the biggest lifts, and enough accessories to keep joints and weak points covered.",
  },
  endurance: {
    label: "Endurance",
    summary:
      "Uses more reps, shorter rest, and steady conditioning work to build work capacity while still covering all major muscle groups.",
  },
  recomposition: {
    label: "Recomposition",
    summary:
      "Balances strength, muscle building, and conditioning so body composition can improve without specializing too hard in one direction.",
  },
};

function createExercise(name, muscleGroup, description, gifSearchTerm) {
  return {
    name,
    muscleGroup,
    description,
    gifSearchTerm: gifSearchTerm || `${name.toLowerCase()} exercise gif`,
  };
}

function sameAcrossLevels(config) {
  return {
    beginner: config,
    intermediate: config,
    advanced: config,
  };
}

const UPPER_PUSH_MOVEMENTS = {
  horizontalPressPrimary: {
    beginner: createExercise(
      "Machine Chest Press",
      "Chest, Front Shoulders, Triceps",
      "Press the handles forward with your shoulder blades lightly pinned to the pad and your feet driving into the floor.",
      "machine chest press exercise gif"
    ),
    intermediate: createExercise(
      "Barbell Bench Press",
      "Chest, Front Shoulders, Triceps",
      "Lower the bar with control to the mid-chest and press it back up without losing upper-back tension.",
      "barbell bench press exercise gif"
    ),
    advanced: createExercise(
      "Barbell Bench Press",
      "Chest, Front Shoulders, Triceps",
      "Use a tight setup, consistent touch point, and leg drive to move the bar in a strong repeatable path.",
      "barbell bench press exercise gif"
    ),
  },
  inclinePress: {
    beginner: createExercise(
      "Incline Dumbbell Press",
      "Upper Chest, Front Shoulders, Triceps",
      "Press the dumbbells up from an incline bench while keeping your ribs down and wrists stacked over elbows.",
      "incline dumbbell press exercise gif"
    ),
    intermediate: createExercise(
      "Incline Dumbbell Press",
      "Upper Chest, Front Shoulders, Triceps",
      "Drive the dumbbells upward in a slight arc and pause briefly before lowering under control.",
      "incline dumbbell press exercise gif"
    ),
    advanced: createExercise(
      "Incline Barbell Press",
      "Upper Chest, Front Shoulders, Triceps",
      "Press the bar on a low incline while keeping your shoulder blades retracted and elbows moving under the bar.",
      "incline barbell press exercise gif"
    ),
  },
  verticalPress: {
    beginner: createExercise(
      "Seated Dumbbell Shoulder Press",
      "Shoulders, Triceps, Upper Chest",
      "Press the dumbbells overhead from a stable seated position without arching hard through the lower back.",
      "seated dumbbell shoulder press exercise gif"
    ),
    intermediate: createExercise(
      "Seated Dumbbell Shoulder Press",
      "Shoulders, Triceps, Upper Chest",
      "Move the bells overhead in a smooth line and stop just before shoulder position breaks down.",
      "seated dumbbell shoulder press exercise gif"
    ),
    advanced: createExercise(
      "Standing Barbell Overhead Press",
      "Shoulders, Triceps, Upper Chest",
      "Brace hard, press the bar in a straight line, and bring your head through at the top without leaning back.",
      "barbell overhead press exercise gif"
    ),
  },
  chestFly: {
    beginner: createExercise(
      "Pec Deck Fly",
      "Chest",
      "Bring the pads together in front of your chest while keeping a soft bend in the elbows and tension in the pecs.",
      "pec deck fly exercise gif"
    ),
    intermediate: createExercise(
      "Cable Chest Fly",
      "Chest",
      "Sweep the handles together in a hugging motion and squeeze the chest without letting the shoulders roll forward.",
      "cable chest fly exercise gif"
    ),
    advanced: createExercise(
      "Cable Chest Fly",
      "Chest",
      "Control the stretch position and keep tension through the pecs for the full rep instead of bouncing.",
      "cable chest fly exercise gif"
    ),
  },
  lateralRaise: sameAcrossLevels(
    createExercise(
      "Dumbbell Lateral Raise",
      "Side Delts",
      "Raise the dumbbells out to your sides with soft elbows and stop when your shoulders no longer stay in control.",
      "dumbbell lateral raise exercise gif"
    )
  ),
  tricepsPushdown: sameAcrossLevels(
    createExercise(
      "Rope Triceps Pushdown",
      "Triceps",
      "Press the rope down and slightly apart while keeping your upper arms pinned close to your torso.",
      "rope triceps pushdown exercise gif"
    )
  ),
  dipsOrPushup: {
    beginner: createExercise(
      "Incline Push-Up",
      "Chest, Shoulders, Triceps",
      "Lower your chest toward an elevated surface in one straight line from shoulders through hips.",
      "incline push up exercise gif"
    ),
    intermediate: createExercise(
      "Assisted Dip",
      "Chest, Triceps, Front Shoulders",
      "Lower until the shoulders stay stable and drive back up without swinging your legs.",
      "assisted dip exercise gif"
    ),
    advanced: createExercise(
      "Weighted Dip",
      "Chest, Triceps, Front Shoulders",
      "Stay tall through the chest, descend with control, and press up powerfully without losing shoulder position.",
      "weighted dip exercise gif"
    ),
  },
  overheadTriceps: sameAcrossLevels(
    createExercise(
      "Overhead Cable Triceps Extension",
      "Triceps",
      "Extend the rope overhead while keeping your elbows pointed forward and your torso steady.",
      "overhead cable triceps extension exercise gif"
    )
  ),
  coreAntiExtension: {
    beginner: createExercise(
      "Plank",
      "Core",
      "Brace your abs and glutes hard so your body stays in one straight line from shoulders to heels.",
      "plank exercise gif"
    ),
    intermediate: createExercise(
      "Weighted Plank",
      "Core",
      "Hold a rigid plank position while resisting lower-back extension and keeping the ribs tucked down.",
      "weighted plank exercise gif"
    ),
    advanced: createExercise(
      "Ab Wheel Rollout",
      "Core, Lats",
      "Roll forward only as far as you can keep your ribs down, then pull back in with your abs and lats.",
      "ab wheel rollout exercise gif"
    ),
  },
  rowerFinisher: sameAcrossLevels(
    createExercise(
      "Rowing Machine Sprint",
      "Cardio, Legs, Back",
      "Drive with the legs first, finish with the arms, and keep each stroke powerful instead of jerky.",
      "rowing machine sprint exercise gif"
    )
  ),
  dumbbellBenchVariation: sameAcrossLevels(
    createExercise(
      "Dumbbell Bench Press",
      "Chest, Front Shoulders, Triceps",
      "Press the dumbbells from a stable shoulder position and keep the range controlled on both sides.",
      "dumbbell bench press exercise gif"
    )
  ),
  landminePress: sameAcrossLevels(
    createExercise(
      "Landmine Press",
      "Shoulders, Upper Chest, Triceps",
      "Press the bar upward and slightly forward while staying tall through the trunk and ribs.",
      "landmine press exercise gif"
    )
  ),
  ropeTriceps: sameAcrossLevels(
    createExercise(
      "Rope Overhead Triceps Extension",
      "Triceps",
      "Stretch the rope overhead and finish each rep with full elbow extension without flaring wildly.",
      "rope overhead triceps extension exercise gif"
    )
  ),
  pushPress: {
    beginner: createExercise(
      "Seated Dumbbell Shoulder Press",
      "Shoulders, Triceps",
      "Use a stable seat and smooth press pattern to build overhead pressing control.",
      "seated dumbbell shoulder press exercise gif"
    ),
    intermediate: createExercise(
      "Dumbbell Push Press",
      "Shoulders, Triceps, Legs",
      "Dip slightly through the knees, drive upward, and let the legs help launch the bells overhead.",
      "dumbbell push press exercise gif"
    ),
    advanced: createExercise(
      "Barbell Push Press",
      "Shoulders, Triceps, Legs",
      "Use a sharp dip and drive, then punch the bar overhead while staying stacked through the trunk.",
      "barbell push press exercise gif"
    ),
  },
};

const UPPER_PULL_MOVEMENTS = {
  verticalPull: {
    beginner: createExercise(
      "Lat Pulldown",
      "Lats, Upper Back, Biceps",
      "Pull the bar toward the upper chest while keeping your torso tall and elbows driving down.",
      "lat pulldown exercise gif"
    ),
    intermediate: createExercise(
      "Pull-Up",
      "Lats, Upper Back, Biceps",
      "Start from a dead hang, pull your chest upward, and avoid kicking to clear the bar.",
      "pull up exercise gif"
    ),
    advanced: createExercise(
      "Weighted Pull-Up",
      "Lats, Upper Back, Biceps",
      "Use a full range from dead hang to chest up while keeping the reps crisp and controlled.",
      "weighted pull up exercise gif"
    ),
  },
  rowPrimary: {
    beginner: createExercise(
      "Seated Cable Row",
      "Mid Back, Lats, Biceps",
      "Pull the handle into the lower ribs while sitting tall and squeezing your shoulder blades together.",
      "seated cable row exercise gif"
    ),
    intermediate: createExercise(
      "Barbell Row",
      "Lats, Mid Back, Rear Delts",
      "Keep the torso fixed, pull the bar into the body, and lower it without jerking through the hips.",
      "barbell row exercise gif"
    ),
    advanced: createExercise(
      "Barbell Row",
      "Lats, Mid Back, Rear Delts",
      "Stay braced in the hinge and row the bar explosively without turning the lift into a full-body heave.",
      "barbell row exercise gif"
    ),
  },
  rowSecondary: {
    beginner: createExercise(
      "Chest Supported Row",
      "Mid Back, Rear Delts, Biceps",
      "Pull the handles toward your ribcage while keeping your chest glued to the bench or pad.",
      "chest supported row exercise gif"
    ),
    intermediate: createExercise(
      "Single-Arm Dumbbell Row",
      "Lats, Mid Back, Biceps",
      "Row the bell toward your hip and pause briefly before lowering under control.",
      "single arm dumbbell row exercise gif"
    ),
    advanced: createExercise(
      "Chest Supported Row",
      "Mid Back, Rear Delts, Biceps",
      "Use a clean squeeze at the top of each rep and avoid shrugging the shoulders toward the ears.",
      "chest supported row exercise gif"
    ),
  },
  facePull: sameAcrossLevels(
    createExercise(
      "Cable Face Pull",
      "Rear Delts, Upper Back",
      "Pull the rope toward the bridge of your nose while opening the elbows and keeping the chest tall.",
      "cable face pull exercise gif"
    )
  ),
  rearDeltFly: sameAcrossLevels(
    createExercise(
      "Rear Delt Fly",
      "Rear Delts, Upper Back",
      "Sweep the arms out wide with a soft elbow bend and keep the movement driven by the back of the shoulders.",
      "rear delt fly exercise gif"
    )
  ),
  bicepsCurl: {
    beginner: createExercise(
      "Dumbbell Curl",
      "Biceps",
      "Curl the bells up with still elbows and lower them slowly instead of swinging the weight.",
      "dumbbell curl exercise gif"
    ),
    intermediate: createExercise(
      "EZ-Bar Curl",
      "Biceps",
      "Curl the bar up without rocking your torso and lower under full control through the same path.",
      "ez bar curl exercise gif"
    ),
    advanced: createExercise(
      "Barbell Curl",
      "Biceps",
      "Keep your elbows under the bar and resist using your hips to start the rep.",
      "barbell curl exercise gif"
    ),
  },
  hammerCurl: sameAcrossLevels(
    createExercise(
      "Hammer Curl",
      "Biceps, Brachialis, Forearms",
      "Curl with a neutral grip and keep the upper arm still so the forearms and biceps do the work.",
      "hammer curl exercise gif"
    )
  ),
  backExtension: sameAcrossLevels(
    createExercise(
      "Back Extension",
      "Lower Back, Glutes, Hamstrings",
      "Hinge at the hips and raise your torso until your body forms a straight line without overextending.",
      "back extension exercise gif"
    )
  ),
  farmerCarry: sameAcrossLevels(
    createExercise(
      "Farmer Carry",
      "Grip, Traps, Core",
      "Walk tall with heavy implements at your sides while keeping the ribs down and shoulders packed.",
      "farmer carry exercise gif"
    )
  ),
  bikeIntervals: sameAcrossLevels(
    createExercise(
      "Air Bike Intervals",
      "Cardio, Legs",
      "Push hard during each interval, then let the breathing settle during recovery instead of stopping completely.",
      "air bike intervals exercise gif"
    )
  ),
  latPulldownSecondary: sameAcrossLevels(
    createExercise(
      "Neutral-Grip Lat Pulldown",
      "Lats, Upper Back, Biceps",
      "Pull the handles toward the collarbone while staying tall through the chest and avoiding body swing.",
      "neutral grip lat pulldown exercise gif"
    )
  ),
  singleArmRow: sameAcrossLevels(
    createExercise(
      "Single-Arm Cable Row",
      "Lats, Mid Back, Biceps",
      "Row with one arm at a time so you can focus on full scapular movement and a clean squeeze.",
      "single arm cable row exercise gif"
    )
  ),
  rearDeltCable: sameAcrossLevels(
    createExercise(
      "Cable Rear Delt Fly",
      "Rear Delts, Upper Back",
      "Open the arms wide and think about moving from the back of the shoulders, not from the wrists.",
      "cable rear delt fly exercise gif"
    )
  ),
  preacherCurl: sameAcrossLevels(
    createExercise(
      "Preacher Curl",
      "Biceps",
      "Keep the upper arm glued to the pad and lower the bar slowly to challenge the full range.",
      "preacher curl exercise gif"
    )
  ),
  chestSupportedRow: sameAcrossLevels(
    createExercise(
      "Chest Supported Row",
      "Mid Back, Lats, Biceps",
      "Keep the chest fixed to the bench and row through the elbows with a deliberate squeeze at the top.",
      "chest supported row exercise gif"
    )
  ),
};

const LOWER_BODY_MOVEMENTS = {
  squatPattern: {
    beginner: createExercise(
      "Goblet Squat",
      "Quadriceps, Glutes, Core",
      "Hold the weight at chest height and squat between the hips while keeping the torso stacked and heels grounded.",
      "goblet squat exercise gif"
    ),
    intermediate: createExercise(
      "Barbell Back Squat",
      "Quadriceps, Glutes, Core",
      "Sit down and back with a stable brace, then drive up through the mid-foot without letting the knees cave in.",
      "barbell back squat exercise gif"
    ),
    advanced: createExercise(
      "Barbell Back Squat",
      "Quadriceps, Glutes, Core",
      "Keep the bar path over mid-foot, maintain depth you can own, and explode up without losing your brace.",
      "barbell back squat exercise gif"
    ),
  },
  hingePattern: {
    beginner: createExercise(
      "Dumbbell Romanian Deadlift",
      "Hamstrings, Glutes, Lower Back",
      "Slide the hips backward, keep the dumbbells close to the legs, and stop once the hamstrings are fully loaded.",
      "dumbbell romanian deadlift exercise gif"
    ),
    intermediate: createExercise(
      "Barbell Romanian Deadlift",
      "Hamstrings, Glutes, Lower Back",
      "Hinge with a soft knee bend, keep the bar tight to the thighs, and stand tall by driving the hips through.",
      "barbell romanian deadlift exercise gif"
    ),
    advanced: createExercise(
      "Barbell Romanian Deadlift",
      "Hamstrings, Glutes, Lower Back",
      "Own the eccentric, keep your lats locked in, and stop the descent before spinal position changes.",
      "barbell romanian deadlift exercise gif"
    ),
  },
  legPress: sameAcrossLevels(
    createExercise(
      "Leg Press",
      "Quadriceps, Glutes",
      "Lower the sled until you still have full control, then press evenly through the feet without bouncing.",
      "leg press exercise gif"
    )
  ),
  lungePattern: {
    beginner: createExercise(
      "Reverse Lunge",
      "Quadriceps, Glutes",
      "Step back into a stable split stance and drive through the front foot to return to standing.",
      "reverse lunge exercise gif"
    ),
    intermediate: createExercise(
      "Walking Lunge",
      "Quadriceps, Glutes",
      "Take long controlled steps and keep your torso stacked over the hips on each rep.",
      "walking lunge exercise gif"
    ),
    advanced: createExercise(
      "Bulgarian Split Squat",
      "Quadriceps, Glutes",
      "Drop straight down into the front leg, keep tension through the foot, and stand up without bouncing.",
      "bulgarian split squat exercise gif"
    ),
  },
  legCurl: sameAcrossLevels(
    createExercise(
      "Lying Leg Curl",
      "Hamstrings",
      "Curl the pad toward the glutes and squeeze the hamstrings before lowering slowly.",
      "lying leg curl exercise gif"
    )
  ),
  legExtension: sameAcrossLevels(
    createExercise(
      "Leg Extension",
      "Quadriceps",
      "Extend the knees under control and pause briefly at the top before lowering back down.",
      "leg extension exercise gif"
    )
  ),
  calfRaise: sameAcrossLevels(
    createExercise(
      "Standing Calf Raise",
      "Calves",
      "Drive up through the big toe, pause at the top, and lower fully to use the full ankle range.",
      "standing calf raise exercise gif"
    )
  ),
  hipThrust: {
    beginner: createExercise(
      "Glute Bridge",
      "Glutes, Hamstrings",
      "Drive the hips upward while keeping the ribs tucked and squeezing the glutes hard at lockout.",
      "glute bridge exercise gif"
    ),
    intermediate: createExercise(
      "Barbell Hip Thrust",
      "Glutes, Hamstrings",
      "Press through the heels, finish with a hard glute squeeze, and avoid overextending the lower back.",
      "barbell hip thrust exercise gif"
    ),
    advanced: createExercise(
      "Barbell Hip Thrust",
      "Glutes, Hamstrings",
      "Keep the chin tucked, drive the bar up explosively, and pause for a clean lockout on every rep.",
      "barbell hip thrust exercise gif"
    ),
  },
  cableCrunch: sameAcrossLevels(
    createExercise(
      "Cable Crunch",
      "Abs",
      "Curl the ribs toward the pelvis while keeping the hips mostly fixed and the abs doing the work.",
      "cable crunch exercise gif"
    )
  ),
  sledPush: sameAcrossLevels(
    createExercise(
      "Sled Push",
      "Quadriceps, Glutes, Conditioning",
      "Drive the sled with short powerful steps while staying behind it in a strong forward lean.",
      "sled push exercise gif"
    )
  ),
};
const RECOVERY_MOVEMENTS = {
  treadmillInclineWalk: sameAcrossLevels(
    createExercise(
      "Incline Treadmill Walk",
      "Cardio, Glutes, Calves",
      "Walk at a steady incline pace with a long stride and without hanging onto the rails.",
      "incline treadmill walk exercise gif"
    )
  ),
  rowingMachineSteady: sameAcrossLevels(
    createExercise(
      "Steady Row",
      "Cardio, Legs, Back",
      "Row with smooth repeatable strokes and relaxed breathing instead of turning it into a sprint.",
      "rowing machine steady state exercise gif"
    )
  ),
  shoulderMobilityFlow: sameAcrossLevels(
    createExercise(
      "Shoulder Mobility Flow",
      "Shoulders, Upper Back",
      "Move through controlled shoulder circles and reaches to open up the joint without forcing range.",
      "shoulder mobility flow exercise gif"
    )
  ),
  hipMobilityFlow: sameAcrossLevels(
    createExercise(
      "Hip Mobility Flow",
      "Hips, Glutes",
      "Work through controlled hip openings and rotations to improve position quality before heavier sessions.",
      "hip mobility flow exercise gif"
    )
  ),
  gluteBridge: sameAcrossLevels(
    createExercise(
      "Glute Bridge",
      "Glutes, Hamstrings",
      "Drive the hips upward while keeping the feet planted and the lower back quiet.",
      "glute bridge exercise gif"
    )
  ),
  deadBug: sameAcrossLevels(
    createExercise(
      "Dead Bug",
      "Core",
      "Lower the opposite arm and leg slowly while keeping the lower back gently pressed down.",
      "dead bug exercise gif"
    )
  ),
  sidePlank: sameAcrossLevels(
    createExercise(
      "Side Plank",
      "Obliques, Core",
      "Stack your body in one long line and hold tension through the side wall of the trunk.",
      "side plank exercise gif"
    )
  ),
  hamstringStretch: sameAcrossLevels(
    createExercise(
      "Standing Hamstring Stretch",
      "Hamstrings",
      "Hinge gently over the front leg and breathe into the stretch instead of forcing the position.",
      "standing hamstring stretch exercise gif"
    )
  ),
  thoracicRotation: sameAcrossLevels(
    createExercise(
      "Thoracic Rotation",
      "Upper Back, Core",
      "Rotate through the mid-back while keeping the hips quiet and the breath relaxed.",
      "thoracic rotation exercise gif"
    )
  ),
  breathingReset: sameAcrossLevels(
    createExercise(
      "90-90 Breathing",
      "Core, Recovery",
      "Use slow breaths to bring the ribs down, relax the neck, and reset before the next training day.",
      "90 90 breathing exercise gif"
    )
  ),
};

const MIXED_MOVEMENTS = {
  abWheel: {
    beginner: createExercise(
      "Swiss Ball Rollout",
      "Core, Lats",
      "Roll forward only as far as you can keep the trunk braced, then pull back in smoothly.",
      "swiss ball rollout exercise gif"
    ),
    intermediate: createExercise(
      "Ab Wheel Rollout",
      "Core, Lats",
      "Reach out under control and return by bracing the abs hard instead of yanking with the hips.",
      "ab wheel rollout exercise gif"
    ),
    advanced: createExercise(
      "Ab Wheel Rollout",
      "Core, Lats",
      "Keep the pelvis tucked and use a longer rollout range while staying rigid through the trunk.",
      "ab wheel rollout exercise gif"
    ),
  },
  stairClimber: sameAcrossLevels(
    createExercise(
      "Stair Climber",
      "Cardio, Glutes, Quads",
      "Climb at a steady pace with full foot contact and minimal pressure on the handrails.",
      "stair climber exercise gif"
    )
  ),
  trapBarDeadlift: {
    beginner: createExercise(
      "Kettlebell Deadlift",
      "Glutes, Hamstrings, Quadriceps",
      "Set the hips back, keep the chest tall, and stand up by pushing the floor away evenly.",
      "kettlebell deadlift exercise gif"
    ),
    intermediate: createExercise(
      "Trap Bar Deadlift",
      "Glutes, Hamstrings, Quadriceps",
      "Brace hard before the pull, drive through the whole foot, and lock out without leaning back.",
      "trap bar deadlift exercise gif"
    ),
    advanced: createExercise(
      "Trap Bar Deadlift",
      "Glutes, Hamstrings, Quadriceps",
      "Build tension into the handles before the lift and accelerate the bar from the floor with crisp technique.",
      "trap bar deadlift exercise gif"
    ),
  },
  frontSquat: {
    beginner: createExercise(
      "Leg Press",
      "Quadriceps, Glutes",
      "Use a stable foot position and full control through the bottom range instead of chasing more load.",
      "leg press exercise gif"
    ),
    intermediate: createExercise(
      "Front Squat",
      "Quadriceps, Core, Upper Back",
      "Keep the elbows high, stay upright, and descend only as deep as you can hold the rack position cleanly.",
      "front squat exercise gif"
    ),
    advanced: createExercise(
      "Front Squat",
      "Quadriceps, Core, Upper Back",
      "Use a strong brace and vertical torso to keep the bar stacked over mid-foot through the whole rep.",
      "front squat exercise gif"
    ),
  },
  stepUp: sameAcrossLevels(
    createExercise(
      "Dumbbell Step-Up",
      "Quadriceps, Glutes",
      "Drive through the full foot on the box and avoid pushing excessively off the trail leg.",
      "dumbbell step up exercise gif"
    )
  ),
  romanianDeadliftAccessory: {
    beginner: createExercise(
      "Dumbbell Romanian Deadlift",
      "Hamstrings, Glutes",
      "Hinge until you feel the hamstrings load and stand up by squeezing the glutes back to neutral.",
      "dumbbell romanian deadlift exercise gif"
    ),
    intermediate: createExercise(
      "Romanian Deadlift",
      "Hamstrings, Glutes",
      "Keep the bar close and the spine neutral as you hinge to a controlled stretch and return to standing.",
      "romanian deadlift exercise gif"
    ),
    advanced: createExercise(
      "Romanian Deadlift",
      "Hamstrings, Glutes",
      "Control the full eccentric and avoid sacrificing hip position just to chase more range.",
      "romanian deadlift exercise gif"
    ),
  },
  seatedLegCurl: sameAcrossLevels(
    createExercise(
      "Seated Leg Curl",
      "Hamstrings",
      "Curl through the full machine range and keep tension on the hamstrings instead of bouncing the stack.",
      "seated leg curl exercise gif"
    )
  ),
  walkingLunge: {
    beginner: createExercise(
      "Split Squat",
      "Quadriceps, Glutes",
      "Lower under control in a split stance and push back up through the front foot without wobbling.",
      "split squat exercise gif"
    ),
    intermediate: createExercise(
      "Walking Lunge",
      "Quadriceps, Glutes",
      "Take smooth controlled steps and keep the front knee tracking over the toes on each rep.",
      "walking lunge exercise gif"
    ),
    advanced: createExercise(
      "Walking Lunge",
      "Quadriceps, Glutes",
      "Use long powerful steps and keep your torso stacked to avoid collapsing into the front hip.",
      "walking lunge exercise gif"
    ),
  },
  hangingLegRaise: {
    beginner: createExercise(
      "Captain's Chair Knee Raise",
      "Abs, Hip Flexors",
      "Raise the knees with a controlled curl of the pelvis instead of swinging the legs.",
      "captains chair knee raise exercise gif"
    ),
    intermediate: createExercise(
      "Hanging Knee Raise",
      "Abs, Hip Flexors",
      "Start from a quiet hang and bring the knees up with abdominal control instead of momentum.",
      "hanging knee raise exercise gif"
    ),
    advanced: createExercise(
      "Hanging Leg Raise",
      "Abs, Hip Flexors",
      "Lift the legs without swinging and pause briefly before lowering them under control.",
      "hanging leg raise exercise gif"
    ),
  },
  assaultBikeIntervals: sameAcrossLevels(
    createExercise(
      "Assault Bike Intervals",
      "Cardio, Legs",
      "Alternate hard pushes with easy pedaling so every sprint stays powerful and repeatable.",
      "assault bike intervals exercise gif"
    )
  ),
  quadMobility: sameAcrossLevels(
    createExercise(
      "Couch Stretch",
      "Quadriceps, Hip Flexors",
      "Relax into the front-thigh stretch and keep the glute gently engaged so the pelvis stays neutral.",
      "couch stretch exercise gif"
    )
  ),
  kettlebellSwing: {
    beginner: createExercise(
      "Kettlebell Deadlift",
      "Glutes, Hamstrings",
      "Practice a crisp hip hinge and powerful stand-up before progressing to dynamic swings.",
      "kettlebell deadlift exercise gif"
    ),
    intermediate: createExercise(
      "Kettlebell Swing",
      "Glutes, Hamstrings, Conditioning",
      "Snap the hips to float the kettlebell and let it fall back into the hinge rather than lifting with the arms.",
      "kettlebell swing exercise gif"
    ),
    advanced: createExercise(
      "Kettlebell Swing",
      "Glutes, Hamstrings, Conditioning",
      "Use explosive hip drive and a strong plank at the top so the bell floats without shoulder shrugging.",
      "kettlebell swing exercise gif"
    ),
  },
  gobletReverseLunge: sameAcrossLevels(
    createExercise(
      "Goblet Reverse Lunge",
      "Quadriceps, Glutes",
      "Hold the weight at chest height, step back smoothly, and drive through the front foot to stand.",
      "goblet reverse lunge exercise gif"
    )
  ),
  battleRope: sameAcrossLevels(
    createExercise(
      "Battle Rope Waves",
      "Conditioning, Shoulders, Core",
      "Create crisp waves through the ropes while keeping your knees bent and torso braced.",
      "battle rope waves exercise gif"
    )
  ),
  fullBodyMobilityFlow: sameAcrossLevels(
    createExercise(
      "Full-Body Mobility Flow",
      "Mobility, Recovery",
      "Move through slow full-body transitions to unload stiffness and finish the week feeling better than you started.",
      "full body mobility flow exercise gif"
    )
  ),
};

const MOVEMENT_LIBRARY = {
  ...UPPER_PUSH_MOVEMENTS,
  ...UPPER_PULL_MOVEMENTS,
  ...LOWER_BODY_MOVEMENTS,
  ...RECOVERY_MOVEMENTS,
  ...MIXED_MOVEMENTS,
};

const DAY_TEMPLATES = [
  {
    day: 1,
    titles: { "muscle-gain": "Push Hypertrophy", "fat-loss": "Upper Push + Conditioning", strength: "Heavy Push Day", endurance: "Push Capacity Session", recomposition: "Upper Push Session" },
    focus: "Train pressing strength and shoulder-friendly upper-body volume.",
    exercises: [
      { movement: "horizontalPressPrimary", type: "mainCompound" },
      { movement: "inclinePress", type: "secondaryCompound" },
      { movement: "verticalPress", type: "secondaryCompound" },
      { movement: "chestFly", type: "accessory" },
      { movement: "lateralRaise", type: "isolation" },
      { movement: "tricepsPushdown", type: "isolation" },
      { movement: "dipsOrPushup", type: "accessory" },
      { movement: "overheadTriceps", type: "isolation" },
      { movement: "coreAntiExtension", type: "core" },
      { movement: "rowerFinisher", type: "conditioning" },
    ],
  },
  {
    day: 2,
    titles: { "muscle-gain": "Pull Hypertrophy", "fat-loss": "Upper Pull + Conditioning", strength: "Heavy Pull Day", endurance: "Pull Capacity Session", recomposition: "Upper Pull Session" },
    focus: "Build the lats, upper back, and arms with one heavy pull plus layered accessories.",
    exercises: [
      { movement: "verticalPull", type: "mainCompound" },
      { movement: "rowPrimary", type: "secondaryCompound" },
      { movement: "rowSecondary", type: "accessory" },
      { movement: "facePull", type: "isolation" },
      { movement: "rearDeltFly", type: "isolation" },
      { movement: "bicepsCurl", type: "isolation" },
      { movement: "hammerCurl", type: "isolation" },
      { movement: "backExtension", type: "accessory" },
      { movement: "farmerCarry", type: "carry" },
      { movement: "bikeIntervals", type: "conditioning" },
    ],
  },
  {
    day: 3,
    titles: { "muscle-gain": "Leg Hypertrophy", "fat-loss": "Lower Body + Density", strength: "Primary Lower Strength Day", endurance: "Lower Body Capacity", recomposition: "Lower Body Session" },
    focus: "Cover quads, glutes, hamstrings, calves, and trunk with a big squat and hinge base.",
    exercises: [
      { movement: "squatPattern", type: "mainCompound" },
      { movement: "hingePattern", type: "secondaryCompound" },
      { movement: "legPress", type: "accessory" },
      { movement: "lungePattern", type: "accessory" },
      { movement: "legCurl", type: "isolation" },
      { movement: "legExtension", type: "isolation" },
      { movement: "calfRaise", type: "isolation" },
      { movement: "hipThrust", type: "accessory" },
      { movement: "cableCrunch", type: "core" },
      { movement: "sledPush", type: "conditioning" },
    ],
  },
  {
    day: 4,
    titles: { "muscle-gain": "Active Recovery + Core", "fat-loss": "Recovery Conditioning Day", strength: "Recovery + Positioning Day", endurance: "Aerobic Recovery Day", recomposition: "Active Recovery Day" },
    focus: "Lower the stress, improve movement quality, and keep blood flow high without beating up recovery.",
    exercises: [
      { movement: "treadmillInclineWalk", type: "conditioningEasy" },
      { movement: "rowingMachineSteady", type: "conditioningEasy" },
      { movement: "shoulderMobilityFlow", type: "mobility" },
      { movement: "hipMobilityFlow", type: "mobility" },
      { movement: "gluteBridge", type: "accessory" },
      { movement: "deadBug", type: "core" },
      { movement: "sidePlank", type: "core" },
      { movement: "hamstringStretch", type: "mobility" },
      { movement: "thoracicRotation", type: "mobility" },
      { movement: "breathingReset", type: "mobility" },
    ],
  },
  {
    day: 5,
    titles: { "muscle-gain": "Upper Mixed Volume", "fat-loss": "Upper Mixed Density", strength: "Upper Assistance Strength Day", endurance: "Upper Mixed Capacity", recomposition: "Upper Mixed Session" },
    focus: "Get a second upper-body touch with balanced pressing, pulling, delts, and arms.",
    exercises: [
      { movement: "dumbbellBenchVariation", type: "secondaryCompound" },
      { movement: "latPulldownSecondary", type: "secondaryCompound" },
      { movement: "landminePress", type: "accessory" },
      { movement: "singleArmRow", type: "accessory" },
      { movement: "chestFly", type: "isolation" },
      { movement: "rearDeltCable", type: "isolation" },
      { movement: "lateralRaise", type: "isolation" },
      { movement: "preacherCurl", type: "isolation" },
      { movement: "ropeTriceps", type: "isolation" },
      { movement: "abWheel", type: "core" },
    ],
  },
  {
    day: 6,
    titles: { "muscle-gain": "Lower Mixed Volume", "fat-loss": "Lower Mixed Density", strength: "Secondary Lower Strength Day", endurance: "Lower Mixed Capacity", recomposition: "Lower Mixed Session" },
    focus: "Train a second lower-body pattern with unilateral work, posterior chain work, and a finisher.",
    exercises: [
      { movement: "trapBarDeadlift", type: "mainCompound" },
      { movement: "frontSquat", type: "secondaryCompound" },
      { movement: "stepUp", type: "accessory" },
      { movement: "romanianDeadliftAccessory", type: "accessory" },
      { movement: "seatedLegCurl", type: "isolation" },
      { movement: "walkingLunge", type: "accessory" },
      { movement: "calfRaise", type: "isolation" },
      { movement: "hangingLegRaise", type: "core" },
      { movement: "assaultBikeIntervals", type: "conditioning" },
      { movement: "quadMobility", type: "mobility" },
    ],
  },
  {
    day: 7,
    titles: { "muscle-gain": "Full-Body Pump + Conditioning", "fat-loss": "Full-Body Conditioning Lift", strength: "Full-Body Power Assistance", endurance: "Full-Body Capacity Circuit", recomposition: "Full-Body Finisher Day" },
    focus: "Finish the week with whole-body work that is productive without turning into another all-out max day.",
    exercises: [
      { movement: "pushPress", type: "mainCompound" },
      { movement: "chestSupportedRow", type: "secondaryCompound" },
      { movement: "gobletReverseLunge", type: "accessory" },
      { movement: "landminePress", type: "accessory" },
      { movement: "kettlebellSwing", type: "conditioning" },
      { movement: "farmerCarry", type: "carry" },
      { movement: "hangingLegRaise", type: "core" },
      { movement: "battleRope", type: "conditioning" },
      { movement: "stairClimber", type: "conditioningEasy" },
      { movement: "fullBodyMobilityFlow", type: "mobility" },
    ],
  },
];

function normalizeInput(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeGoal(rawGoal) {
  const goal = normalizeInput(rawGoal);

  if (!goal) {
    return null;
  }

  if (["muscle-gain", "muscle", "gain", "bulk", "bulking", "hypertrophy"].includes(goal)) {
    return "muscle-gain";
  }

  if (
    [
      "fat-loss",
      "fatloss",
      "weight-loss",
      "weightloss",
      "cut",
      "cutting",
      "leaning-out",
      "lean-out",
    ].includes(goal)
  ) {
    return "fat-loss";
  }

  if (["strength", "power", "powerlifting"].includes(goal)) {
    return "strength";
  }

  if (["endurance", "conditioning", "stamina", "athletic-endurance"].includes(goal)) {
    return "endurance";
  }

  if (["recomposition", "recomp", "maintenance", "general-fitness", "toning", "tone"].includes(goal)) {
    return "recomposition";
  }

  return null;
}

function toExerciseCount(value) {
  const parsed = Number(value);
  return Number.isInteger(parsed) ? parsed : null;
}

function validateWorkoutRequest(input) {
  const fitnessLevel = normalizeInput(input?.fitnessLevel);
  const goal = normalizeGoal(input?.goal);
  const exercisesPerDay = toExerciseCount(input?.exercisesPerDay);

  if (!VALID_FITNESS_LEVELS.includes(fitnessLevel)) {
    return {
      error: `fitnessLevel must be one of: ${VALID_FITNESS_LEVELS.join(", ")}`,
    };
  }

  if (!goal) {
    return {
      error:
        "goal must map to one of: muscle-gain, fat-loss, strength, endurance, recomposition",
    };
  }

  if (!VALID_EXERCISE_COUNTS.includes(exercisesPerDay)) {
    return {
      error: `exercisesPerDay must be one of: ${VALID_EXERCISE_COUNTS.join(", ")}`,
    };
  }

  return {
    fitnessLevel,
    goal,
    exercisesPerDay,
  };
}

function getPrescription(goal, fitnessLevel, type) {
  const baseProfiles = {
    "muscle-gain": { mainCompound: ["4", "6-10", "90 sec"], secondaryCompound: ["4", "8-12", "75 sec"], accessory: ["3", "10-12", "60 sec"], isolation: ["3", "12-15", "45 sec"], core: ["3", "12-15", "30-45 sec"], carry: ["4", "30-40 m", "45 sec"], conditioning: ["1", "10-12 min", "0 sec"], conditioningEasy: ["1", "15-20 min", "0 sec"], mobility: ["2", "45 sec per drill", "15 sec"] },
    "fat-loss": { mainCompound: ["4", "8-12", "75 sec"], secondaryCompound: ["3-4", "10-12", "60 sec"], accessory: ["3", "12-15", "45 sec"], isolation: ["3", "12-15", "30-45 sec"], core: ["3", "15-20", "30 sec"], carry: ["4", "30 m", "30-45 sec"], conditioning: ["1", "12-15 min", "0 sec"], conditioningEasy: ["1", "18-25 min", "0 sec"], mobility: ["2", "45 sec per drill", "15 sec"] },
    strength: { mainCompound: ["5", "4-6", "150 sec"], secondaryCompound: ["4", "5-8", "105 sec"], accessory: ["3", "8-10", "60 sec"], isolation: ["3", "10-12", "45 sec"], core: ["3", "10-15", "30-45 sec"], carry: ["4", "30-35 m", "60 sec"], conditioning: ["1", "8-10 min", "0 sec"], conditioningEasy: ["1", "15-18 min", "0 sec"], mobility: ["2", "45 sec per drill", "15 sec"] },
    endurance: { mainCompound: ["4", "10-15", "60 sec"], secondaryCompound: ["3-4", "12-15", "45 sec"], accessory: ["3", "15-20", "30-45 sec"], isolation: ["3", "15-20", "30 sec"], core: ["3", "15-20", "30 sec"], carry: ["4", "25-30 m", "30 sec"], conditioning: ["1", "15-18 min", "0 sec"], conditioningEasy: ["1", "18-25 min", "0 sec"], mobility: ["2", "45 sec per drill", "15 sec"] },
    recomposition: { mainCompound: ["4", "6-10", "90 sec"], secondaryCompound: ["3-4", "8-12", "75 sec"], accessory: ["3", "10-12", "60 sec"], isolation: ["3", "12-15", "45 sec"], core: ["3", "12-15", "30-45 sec"], carry: ["4", "30-35 m", "45 sec"], conditioning: ["1", "10-12 min", "0 sec"], conditioningEasy: ["1", "15-20 min", "0 sec"], mobility: ["2", "45 sec per drill", "15 sec"] },
  };

  const beginnerOverrides = {
    mainCompound: ["3", goal === "strength" ? "5-6" : goal === "endurance" ? "12-15" : goal === "fat-loss" ? "10-12" : "8-10", goal === "strength" ? "120 sec" : goal === "fat-loss" || goal === "endurance" ? "60-75 sec" : "90 sec"],
    secondaryCompound: ["3", goal === "strength" ? "6-8" : "10-12", goal === "strength" ? "90 sec" : "60-75 sec"],
    carry: ["3", goal === "endurance" ? "20-30 m" : "25-30 m", goal === "strength" ? "60 sec" : "30-45 sec"],
    conditioning: ["1", goal === "strength" ? "6-8 min" : goal === "endurance" ? "12-15 min" : "8-12 min", "0 sec"],
    conditioningEasy: ["1", goal === "fat-loss" ? "15-20 min" : "12-18 min", "0 sec"],
    mobility: ["2", "30-45 sec per drill", "15 sec"],
  };

  const advancedOverrides = {
    mainCompound: [goal === "strength" ? "5-6" : "5", goal === "strength" ? "3-5" : goal === "muscle-gain" ? "5-8" : goal === "fat-loss" ? "6-10" : "8-15", goal === "strength" ? "150-180 sec" : goal === "muscle-gain" ? "120 sec" : goal === "fat-loss" ? "90 sec" : "60 sec"],
    accessory: ["4", goal === "endurance" ? "12-20" : goal === "strength" ? "6-10" : "8-12", goal === "strength" ? "75 sec" : "45-60 sec"],
    core: ["4", goal === "strength" ? "8-12" : goal === "fat-loss" || goal === "endurance" ? "15-20" : "10-15", "30-45 sec"],
    carry: ["4", goal === "endurance" ? "30-40 m" : "35-40 m", goal === "strength" ? "60 sec" : "30-45 sec"],
    conditioning: ["1", goal === "fat-loss" ? "15-18 min" : goal === "endurance" ? "18-20 min" : "10-15 min", "0 sec"],
    conditioningEasy: ["1", goal === "fat-loss" || goal === "endurance" ? "20-30 min" : "18-22 min", "0 sec"],
    mobility: ["2", "45-60 sec per drill", "15 sec"],
  };

  const profile = baseProfiles[goal][type];
  const override = fitnessLevel === "beginner" ? beginnerOverrides[type] : fitnessLevel === "advanced" ? advancedOverrides[type] : null;
  const [sets, reps, restTime] = override || profile;

  return { sets, reps, restTime };
}

function buildExercise(goal, fitnessLevel, item) {
  const movement = MOVEMENT_LIBRARY[item.movement][fitnessLevel];
  const prescription = getPrescription(goal, fitnessLevel, item.type);
  return { name: movement.name, sets: prescription.sets, reps: prescription.reps, restTime: prescription.restTime, muscleGroup: movement.muscleGroup, description: movement.description, gifSearchTerm: movement.gifSearchTerm };
}

function buildWorkoutPlan({ fitnessLevel, goal, exercisesPerDay }) {
  return {
    planName: `7-Day ${GOAL_DETAILS[goal].label} Workout Plan`,
    fitnessLevel,
    goal,
    goalLabel: GOAL_DETAILS[goal].label,
    exerciseCountPerDay: exercisesPerDay,
    generatedAt: new Date().toISOString(),
    summary: GOAL_DETAILS[goal].summary,
    splitStyle: "7-day gym split with one lower-intensity recovery day",
    instructions: [
      "Choose loads that leave 1-3 good reps in reserve on most working sets.",
      "Use the gifSearchTerm in your preferred client instead of relying on hardcoded third-party GIF URLs.",
      "Keep day 4 easy enough that you feel fresher, not flatter, afterward.",
      "Swap any painful exercise for a similar movement pattern that stays pain-free.",
    ],
    days: DAY_TEMPLATES.map((template) => ({
      day: template.day,
      title: template.titles[goal],
      focus: template.focus,
      exercises: template.exercises.slice(0, exercisesPerDay).map((item) => buildExercise(goal, fitnessLevel, item)),
    })),
  };
}

function sendWorkoutPlanResponse(req, res, input) {
  const validation = validateWorkoutRequest(input);
  if (validation.error) {
    return res.status(400).json({ error: validation.error });
  }
  return res.json({ plan: buildWorkoutPlan(validation) });
}

export function getWorkoutPlan(req, res) {
  return sendWorkoutPlanResponse(req, res, req.query);
}

export function generateWorkoutPlan(req, res) {
  return sendWorkoutPlanResponse(req, res, req.body);
}
