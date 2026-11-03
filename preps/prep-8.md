**Part 1:** how many of 3 runs were hits before and after the prompt defense, and whether the defense held (including after you tried rewording review 3).

Before the prompt defense, all 3 runs were hits. After the prompt dense, none of the 3 runs were hits.

**Part 2:** the username and password you used in step 3, the SQL: line it produced, and the result of the same attack after the fix.

I used the username "admin'--" and the password "", and the SQL line that it produced was SQL: SELECT * FROM users WHERE username = 'admin'--' AND password = ''. After the fix, the attack failed.

**Reflection (1-2 sentences):** The Part 1 defense works by adding another sentence in the same request as the review. The Part 2 defense works by preventing username pasting into the query. Why can the first fix still produce a hit, while the second fix is guaranteed to stop the attack?

The first fix can still produce a hit because LLMs are probabilistic, so not wording the prompt firmly enough or having an overwhelming enough attack could still work. The second fix is guaranteed to stop the attack because it types the user input, completely sanitizing it.