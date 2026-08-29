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
      { emoji: '❤️', trigger: 'wishlist-add', color: '#FF1744', label: 'Loved!' },
      { emoji: '💝', trigger: 'wishlist-add', color: '#FF69B4', label: 'Saved!' },
      
      // Success Actions
      { emoji: '✨', trigger: 'success', color: '#FFD700', label: 'Perfect!' },
      { emoji: '🎉', trigger: 'success', color: '#FF6B9D', label: 'Woohoo!' },
      { emoji: '⭐', trigger: 'success', color: '#FFC107', label: 'Awesome!' },
      
      // Checkout Actions
      { emoji: '💳', trigger: 'checkout', color: '#4CAF50', label: 'Payment!' },
      { emoji: '✓', trigger: 'checkout', color: '#4CAF50', label: 'Confirmed!' },
      { emoji: '🎁', trigger: 'order-placed', color: '#9C27B0', label: 'Order!' },
      
      // Purchase Success
      { emoji: '🚀', trigger: 'order-placed', color: '#2196F3', label: 'Shipped!' },
      { emoji: '👍', trigger: 'success', color: '#FF9800', label: 'Great!' },
      { emoji: '💕', trigger: 'wishlist-add', color: '#E91E63', label: 'Liked!' },
      
      // Remove/Negative
      { emoji: '🗑️', trigger: 'remove', color: '#F44336', label: 'Removed!' },
      { emoji: '😢', trigger: 'out-of-stock', color: '#9E9E9E', label: 'OOS!' },
    ];

    this.init();
  }

  init() {
    this.createContainer();
    this.attachEventListeners();
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
        originalAddToCart.call(window, id);
        const event = new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          view: window
        });
        const button = event.target;
        const x = event.clientX || window.innerWidth / 2;
        const y = event.clientY || window.innerHeight / 2;
        this.burstEmojis('add-to-cart', x, y, 3);
      };
    }

    // Intercept Wishlist Toggle
    const originalToggleWishlist = window.toggleWishlist;
    if (originalToggleWishlist) {
      window.toggleWishlist = (id) => {
        const product = products?.find(p => p.id === id);
        const isAdding = !wishlist.includes(id);
        
        originalToggleWishlist.call(window, id);
        
        if (isAdding) {
          this.burstEmojis('wishlist-add', window.innerWidth / 2, window.innerHeight / 3, 4);
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
              emojiSystem.burstEmojis('order-placed', window.innerWidth / 2, window.innerHeight / 2, 8);
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
