<template>
  <form>
    <label for="password">Password</label>
    <input id="password" type="password" v-model="passwordValue" />
    <span v-if="score === 0">Use better password</span>

    <password-meter :password="passwordValue" @score="onScore" />
  </form>
</template>

<script>
import passwordMeter from "vue-simple-password-meter";

export default {
  components: { passwordMeter },
  data: () => ({
    passwordValue: null,
    score: null
  }),
  methods: {
    onScore({ score, strength }) {
      console.log(score); // from 0 to 4
      console.log(strength); // one of : 'risky', 'guessable', 'weak', 'safe' , 'secure' 
      this.score = score;
    }
  }
};
</script>