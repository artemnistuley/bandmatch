<template>
    <div class="similar-artists">
        <div class="similar-artists__title">Similar Artists</div>

        <div class="similar-artists__list">
            <div class="similar-artists__item" v-for="artist in artists" :key="artist.name">
                <a class="similar-artists__name" :href="artist.url" target="_blank">{{ artist.name }}</a>
                <div class="similar-artists__match">Match: {{ artist.match }}</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        artists: Array,
    },
}
</script>

<style lang="scss" scoped>
.similar-artists {
    margin-top: 5rem;

    &__title {
        font-size: 2.4rem;
    }

    &__list {
        margin-top: .5rem;
    }

    &__item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 5px;
        padding: 1.5rem 0;
        border-bottom: .1rem solid rgba(0, 0, 0, 0.12);

        &:last-child {
            border: 0;
        }
    }

    &__name {
        font-size: 1.6rem;
        color: inherit;
        text-decoration: none;

        &:hover {
            color: #33cc9d;
            transition: all .2s;
        }
    }

    &__match {
        font-size: 1.4rem;
        color: rgba(0, 0, 0, 0.54);
    }
}

@media only screen and (max-width: 600px) {
    .similar-artists {

        &__item {
            flex-direction: column;
            align-items: start;
        }
    }
}
</style>
