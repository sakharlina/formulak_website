class FeedbackLoader {
    constructor() {
        this.container = document.getElementById('feedback-container');
        this.button = document.getElementById('feedback-button-callback');
        this.ratingElement = document.querySelector('.rating-block p:last-child');
        this.starContainer = document.querySelector('.star-queue');
        this.offset = 0;
        this.isLoading = false;
        this.init();
    }

    async init() {
        try {
            await this.loadAverageRating();
            await this.loadFeedbacks();
            
            if (this.button) {
                this.button.addEventListener('click', () => this.loadFeedbacks());
            }
        } catch (error) {
            console.error('Initialization error:', error);
            this.showError('Не удалось загрузить данные');
        }
    }

    async loadAverageRating() {
        try {
            const response = await fetch('http://formulakarting.ru/get_feedback.php?rating_only=1');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.success && this.ratingElement) {
                this.updateRatingDisplay(data.averageRating);
            }
        } catch (error) {
            console.error('Rating load error:', error);
            this.updateRatingDisplay('5,0');
        }
    }

    updateRatingDisplay(rating) {
        if (this.ratingElement) {
            this.ratingElement.textContent = rating;
        }
        
        if (this.starContainer) {
            try {
                const numericRating = typeof rating === 'string' 
                    ? parseFloat(rating.replace(',', '.')) 
                    : rating;
                
                const fullStars = Math.floor(numericRating);
                const fractionalPart = numericRating - fullStars;
                
                this.starContainer.innerHTML = '';
                
                for (let i = 0; i < fullStars; i++) {
                    this.starContainer.innerHTML += '<img src="images/star.png" width="30" alt="">';
                }
                
                if (fractionalPart > 0 && fullStars < 5) {
                    const partialValue = Math.round(fractionalPart * 10);
                    this.starContainer.innerHTML += `<img src="images/star-${partialValue}.png" width="30" alt="">`;
                }
                
                const totalStarsAdded = fullStars + (fractionalPart > 0 ? 1 : 0);
                const emptyStars = 5 - totalStarsAdded;
                
                for (let i = 0; i < emptyStars; i++) {
                    this.starContainer.innerHTML += '<img src="images/star-empty.png" width="35" alt="">';
                }
                
            } catch (e) {
                console.error('Star update error:', e);
            }
        }
    }

    async loadFeedbacks() {
        if (this.isLoading) return;
        this.isLoading = true;
        
        try {
            this.showLoading(true);
            
            const response = await fetch('http://formulakarting.ru/get_feedback.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ offset: this.offset })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.message || 'Invalid server response');
            }
            
            this.processFeedbacks(data);
            
            if (data.averageRating) {
                this.updateRatingDisplay(data.averageRating);
            }
            
        } catch (error) {
            console.error('Feedbacks load error:', error);
            this.showError('Ошибка загрузки отзывов');
        } finally {
            this.showLoading(false);
            this.isLoading = false;
        }
    }

    processFeedbacks(data) {
        if (!data.feedbacks || data.feedbacks.length === 0) {
            if (this.button) {
                setTimeout(() => this.button.remove());
            }
            return;
        }
        
        data.feedbacks.forEach(feedback => {
            const element = this.createFeedbackElement(feedback);
            this.container.insertBefore(element, this.button);
        });
        
        this.offset += data.feedbacks.length;
        
        if (!data.hasMore && this.button) {
            setTimeout(() => this.button.remove());
        }
    }

    createFeedbackElement(feedback) {
        const div = document.createElement('div');
        div.className = 'feedback-of-people';
        
        const rating = feedback.rating || 5;
        const stars = Array.from({length: 5}, (_, i) => 
            `<img src="images/star${i < rating ? '' : '-empty'}.png" width="29" alt="">`
        ).join('');
        
        const date = feedback.date ? new Date(feedback.date) : new Date();
        const formattedDate = date.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
        
        div.innerHTML = `
            <p><b>${feedback.author || 'Аноним'}</b></p>
            <div class="inline-feedback-block">
                <div class="star-queue-mini">${stars}</div>
                <p class="feedback-date">${formattedDate}</p>
            </div>
            <p>${feedback.text || 'Без текста'}</p>
        `;
        
        return div;
    }

    showLoading(isLoading) {
        if (this.button) {
            this.button.disabled = isLoading;
            this.button.textContent = isLoading ? 'загрузка...' : 'показать еще';
        }
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'feedback-error';
        errorDiv.style.cssText = `
            color: #721c24;
            padding: 10px;
            margin: 10px 0;
            border-radius: 4px;
        `;
        errorDiv.textContent = message;
        
        this.container.appendChild(errorDiv);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new FeedbackLoader();
});