<template>
    <div class="artist-info">
        <div class="artist-info__name">{{ name }}</div>

        <div class="artist-info__summary" v-html="summary" />

        <div class="artist-info__tags">
            <div 
                class="artist-info__tag" 
                v-for="tag in tags" 
                :key="tag">
                {{ tag }}
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        name: String,
        summary: String,
        tags: Array,
    }
}
</script>

<style lang="scss" scoped>
.artist-info {
    margin-top: 5rem;

    &__name {
        font-size: 2.4rem;
    }

    &__summary {
        font-size: 1.4rem;
        line-height: 1.5;
        margin-top: 2rem;

        ::v-deep(a) {
            color: inherit;
        }
    }

    &__tags {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
        margin-top: 2rem;
    }

    &__tag {
        font-size: 1.4rem;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        background: #e1e1e8;
        border-radius: .5rem;
        padding: .5rem 1rem;
        user-select: none;
    }
}
</style>
