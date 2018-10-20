<template>
  <v-container>
    <v-layout row>
      <v-flex xs12>
        <v-card v-if="!loading">
          <v-img
            :src="ad.imageSrc"
            height="300px"
          ></v-img>
          <v-card-text>
            <h1 class="text--primary">{{ad.title}}</h1>
            <p>{{ad.description}}</p>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <addEditAdModal class="mr-1" :ad="ad" v-if="isOwner"></addEditAdModal>
            <app-buy-modal :ad="ad"></app-buy-modal>
          </v-card-actions>
        </v-card>
        <div v-else class="text-xs-center">
          <v-progress-circular
            :size="70"
            :width="7"
            color="purple"
            indeterminate
          ></v-progress-circular>
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import EditAdModal from './EditAdModal'
  export default {
    props: ['id'],
    computed: {
      ad () {
        return this.$store.getters.adById(this.id)
      },
      loading () {
        return this.$store.getters.loading
      },
      isOwner () {
         return this.$store.getters.user && this.$store.getters.user.uid === this.ad.ownerId
      }
    },
    components: {
      addEditAdModal: EditAdModal
    }
  }
</script>
