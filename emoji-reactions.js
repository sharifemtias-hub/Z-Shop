/**
 * ===================================
 * ADVANCED EMOJI REACTIONS SYSTEM
 * Cute, Premium 3D Effect Floating Emojis
 * ===================================
 */

class EmojiReactionSystem {
  constructor() {
    this.container = null;
    this.reactions = [
      // Shopping Actions
      { emoji: '🛒', trigger: 'add-to-cart', color: '#FF6B6B', label: 'Added!' },
      { emoji: '💝', trigger: 'add-to-cart', color: '#FF1744', label: 'Saved!' },
      { emoji: '✨', trigger: 'add-to-cart', color: '#FFD700', label: 'Nice!' },
      
      // Wishlist Actions
      { emoji: '❤️', trigger: 'wishlist-add', color: '#FF1744', label: 'Loved!' },
      { emoji: '💕', trigger: 'wishlist-add', color: '#E91E63', label: 'Liked!' },
      { emoji: '💖', trigger: 'wishlist-add', color: '#F06292', label: 'Adored!' },
      { emoji: '🌸', trigger: 'wishlist-add', color: '#FF69B4', label: 'Beautiful!' },
      
      // Success Actions
      { emoji: '✨', trigger: 'success', color: '#FFD700', label: 'Perfect!' },
      { emoji: '🎉', trigger: 'success', color: '#FF6B9D', label: 'Woohoo!' },
      { emoji: '⭐', trigger: 'success', color: '#FFC107', label: 'Awesome!' },
      { emoji: '🌟', trigger: 'success', color: '#FFD700', label: 'Stellar!' },
      
      // Checkout Actions
      { emoji: '💳', trigger: 'checkout', color: '#4CAF50', label: 'Payment!' },
      { emoji: '✓', trigger: 'checkout', color: '#4CAF50', label: 'Done!' },
      { emoji: '💚', trigger: 'checkout', color: '#4CAF50', label: 'Confirmed!' },
      
      // Order Placed
      { emoji: '🎁', trigger: 'order-placed', color: '#9C27B0', label: 'Order!' },
      { emoji: '🚀', trigger: 'order-placed', color: '#2196F3', label: 'Shipped!' },
      { emoji: '📦', trigger: 'order-placed', color: '#FF9800', label: 'Coming!' },
      { emoji: '🎊', trigger: 'order-placed', color: '#FF6B9D', label: 'Yay!' },
      
      // Wishlist Remove
      { emoji: '🗑️', trigger: 'remove', color: '#F44336', label: 'Removed!' },
      
      // Out of Stock
      { emoji: '😢', trigger: 'out-of-stock', color: '#9E9E9E', label: 'OOS!' },
      
      // Welcome Message
      { emoji: '👋', trigger: 'welcome', color: '#2196F3', label: 'Welcome!' },
      { emoji: '🎉', trigger: 'welcome', color: '#FF6B9D', label: 'Hello!' },
      { emoji: '💫', trigger: 'welcome', color: '#FFD700', label: 'Hi!' },
      { emoji: '✨', trigger: 'welcome', color: '#00BCD4', label: 'Hey!' },
      { emoji: '🌈', trigger: 'welcome', color: '#9C27B0', label: 'Hooray!' },
    ];

    this.init();
  }

  init() {
    this.createContainer();
    this.attachEventListeners();
    this.showWelcomeMessage();
  }

  createContainer() {
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'emoji-reactions-container';
      this.container.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 9999;
      `;
      document.body.appendChild(this.container);
    }
  }

  /**
   * Welcome message with floating emojis at bottom
   */
  showWelcomeMessage() {
    const welcomeEmojis = [
      { emoji: '👋', delay: 0 },
      { emoji: '🎉', delay: 200 },
      { emoji: '💫', delay: 400 },
      { emoji: '✨', delay: 600 },
      { emoji: '🌟', delay: 800 },
    ];

    welcomeEmojis.forEach(item => {
      setTimeout(() => {
        this.createWelcomeEmoji(item.emoji);
      }, item.delay);
    });
  }

  /**
   * Create welcome emoji floating at bottom
   */
  createWelcomeEmoji(emoji) {
    const welcomeEmoji = document.createElement('div');
    welcomeEmoji.className = 'welcome-emoji';
    welcomeEmoji.innerHTML = emoji;
    
    const randomX = Math.random() * (window.innerWidth - 60);
    const startY = window.innerHeight - 80;
    
    welcomeEmoji.style.cssText = `
      position: fixed;
      left: ${randomX}px;
      bottom: 20px;
      font-size: 48px;
      pointer-events: none;
      z-index: 9999;
      user-select: none;
      -webkit-user-select: none;
      animation: welcomeFloat 4s ease-out forwards;
    `;
    
    document.body.appendChild(welcomeEmoji);
    
    setTimeout(() => welcomeEmoji.remove(), 4000);
  }

  /**
   * Create a floating emoji with 3D perspective
   */
  createFloatingEmoji(triggerType, x = window.innerWidth / 2, y = window.innerHeight / 2) {
    const reactionList = this.reactions.filter(r => r.trigger === triggerType);
    if (reactionList.length === 0) return;

    const reaction = reactionList[Math.floor(Math.random() * reactionList.length)];
    
    const emoji = document.createElement('div');
    emoji.className = 'floating-emoji';
    emoji.innerHTML = reaction.emoji;
    
    // Random offset for variety
    const offsetX = (Math.random() - 0.5) * 100;
    const offsetY = (Math.random() - 0.5) * 100;
    const startX = x + offsetX;
    const startY = y + offsetY;
    const scale = 0.5 + Math.random() * 0.5;
    
    // Vary animation duration
    const duration = 2500 + Math.random() * 500;
    const rotationAmount = (Math.random() - 0.5) * 360;
    
    emoji.style.cssText = `
      position: absolute;
      left: ${startX}px;
      top: ${startY}px;
      font-size: ${24 + scale * 20}px;
      font-weight: bold;
      pointer-events: none;
      text-shadow: 
        2px 2px 4px rgba(0,0,0,0.2),
        -2px -2px 4px rgba(255,255,255,0.5);
      filter: drop-shadow(0 8px 16px rgba(0,0,0,0.1));
      transform: perspective(1000px) rotateX(0deg) rotateY(0deg) scale(${scale});
      animation: floatEmoji ${duration}ms ease-out forwards;
      --rotation: ${rotationAmount}deg;
      --offset-x: ${offsetX * 1.5}px;
      --offset-y: ${offsetY * 3}px;
      --color: ${reaction.color};
    `;
    
    this.container.appendChild(emoji);
    
    // Remove after animation
    setTimeout(() => emoji.remove(), duration);
  }

  /**
   * Burst multiple emojis
   */
  burstEmojis(triggerType, x, y, count = 5) {
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        this.createFloatingEmoji(triggerType, x, y);
      }, i * 100);
    }
  }

  /**
   * Attach to existing action handlers
   */
  attachEventListeners() {
    // Intercept Add to Cart
    const originalAddToCart = window.addToCart;
    if (originalAddToCart) {
      window.addToCart = (id) => {
        try {
          originalAddToCart.call(window, id);
          // Trigger emoji burst at center
          setTimeout(() => {
            this.burstEmojis('add-to-cart', window.innerWidth / 2, window.innerHeight / 2, 4);
          }, 100);
        } catch (error) {
          console.error('Error in addToCart:', error);
        }
      };
    }

    // Intercept Wishlist Toggle
    const originalToggleWishlist = window.toggleWishlist;
    if (originalToggleWishlist) {
      window.toggleWishlist = (id) => {
        const isAdding = !wishlist.includes(id);
        
        originalToggleWishlist.call(window, id);
        
        if (isAdding) {
          this.burstEmojis('wishlist-add', window.innerWidth / 2, window.innerHeight / 3, 5);
        }
      };
    }

    // Intercept Place Order
    const originalPlaceOrder = window.placeOrder;
    if (originalPlaceOrder) {
      window.placeOrder = async function() {
        try {
          await originalPlaceOrder.call(window);
          // Burst on success modal appearance
          setTimeout(() => {
            const emojiSystem = window.emojiReactionSystem;
            if (emojiSystem && document.getElementById('successModal').style.display === 'flex') {
              emojiSystem.burstEmojis('order-placed', window.innerWidth / 2, window.innerHeight / 2, 10);
            }
          }, 500);
        } catch (error) {
          throw error;
        }
      };
    }
  }

  /**
   * Trigger custom emoji reaction
   */
  trigger(triggerType, x = null, y = null) {
    if (!x || !y) {
      x = window.innerWidth / 2;
      y = window.innerHeight / 2;
    }
    this.createFloatingEmoji(triggerType, x, y);
  }

  /**
   * Trigger burst reaction
   */
  triggerBurst(triggerType, x = null, y = null, count = 5) {
    if (!x || !y) {
      x = window.innerWidth / 2;
      y = window.innerHeight / 2;
    }
    this.burstEmojis(triggerType, x, y, count);
  }
}

// Initialize and expose globally
window.emojiReactionSystem = new EmojiReactionSystem();

// Export for modular use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EmojiReactionSystem;
}
