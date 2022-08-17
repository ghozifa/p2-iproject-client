<script>
import { useCounterStore } from '../stores/counter';
import { mapState, mapActions } from 'pinia';
import OptionComponent from "../components/OptionComponent.vue"

export default {
    data() {
        return {
            name: "",
            imageUrl: "",
            article: "",
            category: "",
            previewImg: "",
            status: ""
        }
    },
    methods: {
        ...mapActions(useCounterStore, ["fetchDataReview", "fetchCategories", "handleAddPost", "handleEditPost"]),
        upload(event) {
            const image = event.target.files[0];
            this.imageUrl = image;
            this.previewImg = URL.createObjectURL(event.target.files[0]);
        },
        async addPost() {
            var bodyFormData = new FormData();
            bodyFormData.append('name', this.name);
            bodyFormData.append('imageUrl', this.imageUrl);
            bodyFormData.append('article', this.article);
            bodyFormData.append('category', this.category);

            if (!this.$route.params) {
                this.handleAddPost(bodyFormData);
            } else {
                const id = this.$route.params.id;
                this.handleEditPost(bodyFormData, id);
            }
        }
    },
    computed: {
        ...mapState(useCounterStore, ["categories", "reviews"]),
    },
    components: {
        OptionComponent
    },
    async created() {
        if (this.$route.params) {
            const id = this.$route.params.id;
            const response = await this.fetchDataReview(id);
            if (response) {
                const imgUrl = this.reviews[0].imageUrl.slice(7);
                this.name = this.reviews[0].name;
                this.previewImg = "http://localhost:3000/images/" + imgUrl;
                this.imageUrl = this.reviews[0].imageUrl;
                this.article = this.reviews[0].article;
                this.status = this.reviews[0].status;
                const category = await this.fetchCategories(this.reviews[0].CategoryId);
                if (category) {
                    this.category = this.categories[0].name;
                }
            } else {
                await this.fetchCategories();
            }
        }
    }
}
</script>

<template>
    <div class="flex h-screen -mt-20">
        <div class="w-full max-w-sm p-6 m-auto bg-gray-100 rounded-md shadow-md">
            <h1 class="text-3xl font-semibold text-center text-gray-700">Post Review</h1>

            <form class="mt-6" @submit.prevent="addPost">

                <div>
                    <label for="username" class="block text-sm text-gray-800">Post Name</label>
                    <input type="text" v-model="name"
                        class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                        required oninvalid="this.setCustomValidity('Please input the post name first.')"
                        oninput="this.setCustomValidity('')">
                </div>

                <img class="hero container max-w-screen-lg mx-auto pb-10 flex justify-center h-screen mt-4 -mb-10"
                    :src="previewImg" v-if="previewImg" style="width:200px; height:150px">

                <div class="mt-4">
                    <label for="username" class="block text-sm text-gray-800">Image</label>
                    <input type="file" v-on:change="upload"
                        class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40">
                </div>

                <div class="mt-4">
                    <div class="flex items-center justify-between">
                        <label for="password" class="block text-sm text-gray-800">Article</label>
                    </div>
                    <textarea name="article"
                        class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                        required oninvalid="this.setCustomValidity('Please insert the article first.')"
                        oninput="this.setCustomValidity('')" v-model="article"></textarea>
                </div>

                <div class="mt-4">
                    <label for="username" class="block text-sm text-gray-800">Categories</label>
                    <select name="category"
                        class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40 text-center"
                        v-model="category">
                        <option v-if="this.$route.params.id" :value="category" disbaled hidden selected>{{ category }}
                        </option>
                        <option v-else value="-- select value --" disbaled hidden selected>-- select category --
                        </option>
                        <OptionComponent v-for="category in categories" :key="category.id" :category="category"
                            v-bind:value="category.id" />
                    </select>
                </div>

                <div class="mt-4" v-if="this.$route.params.id">
                    <label for="username" class="block text-sm text-gray-800">Status</label>
                    <select name="category"
                        class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40 text-center"
                        v-model="status">
                        <option :value="status" disabled hidden selected>{{ status }}</option>
                        <option value="Active"> Active </option>
                        <option value="Archived"> Archived </option>
                    </select>
                </div>

                <div class="mt-6">
                    <button
                        class="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600">
                        Submit
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>