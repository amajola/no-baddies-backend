/**
 * This code was generated by v0 by Vercel.
 * @see https://v0.dev/t/MfcZ2Ob2OWs
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */

/** Add fonts into your Next.js project:

import { Inter } from 'next/font/google'

inter({
  subsets: ['latin'],
  display: 'swap',
})

To read more about using these font, please visit the Next.js documentation:
- App Directory: https://nextjs.org/docs/app/building-your-application/optimizing/fonts
- Pages Directory: https://nextjs.org/docs/pages/building-your-application/optimizing/fonts
**/
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import Input from "@/components/ui/input";
import {
  HeartIcon,
  MailsIcon,
  MessageCircleIcon,
  MoveHorizontalIcon,
  RepeatIcon,
  SearchIcon,
  SettingsIcon,
  UploadIcon,
} from "@/assets/Icons";

import { hc } from "hono/client";
import { useAtom } from "jotai";
import { AuthorizationAtom } from "@/state";
import { useEffect, useState } from "react";
import { AppType } from "server";
import { PostType } from "../../../server/src/routes/posts/schema";

const Home = () => {
  const [auth, _] = useAtom(AuthorizationAtom);
  const [posts, setPosts] = useState<(typeof PostType._type)[]>([]);
  const client = hc<AppType>("http://localhost:3000/", {
    headers: {
      Authorization: `Bearer w5shpzzemkllcqzuca7lm55sdenp3hfpupzvvgkn`,
    },
  });

  console.log(auth);
  useEffect(() => {
    const handleRequest = async () => {
      const call = await client.posts.$get();
      call.json().then((res) => {
        setPosts(res.posts);
      });
    };
    handleRequest();
  }, []);

  return (
    <div className="flex flex-col h-[100dvh] w-[100dvw]">
      <header className="bg-primary text-primary-foreground py-4 px-6 flex items-center justify-between">
        <div className="text-xl font-bold">Tweeter</div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <SearchIcon className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="sm">
            <MailsIcon className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="sm">
            <SettingsIcon className="w-5 h-5" />
          </Button>
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder-user.jpg" />
            <AvatarFallback>AC</AvatarFallback>
          </Avatar>
        </div>
      </header>
      <div className="flex-1 overflow-auto">
        <div className="grid gap-4 p-4">
          {posts.length > 0
            ? posts.map((post) => {
                return (
                  <Card className="p-4 bg-card text-card-foreground">
                    <div className="flex items-start gap-4">
                      <div className="grid gap-1 flex-1">
                        <div className="flex items-center justify-between">
                          <div className="flex">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src="/placeholder-user.jpg" />
                              <AvatarFallback>AC</AvatarFallback>
                            </Avatar>
                            <div className="flex items-center gap-2">
                              <div className="font-medium">Acme Inc</div>
                              <div className="text-muted-foreground text-sm">
                                @acme
                              </div>
                            </div>
                          </div>

                          <Button variant="ghost" size="sm">
                            <MoveHorizontalIcon className="w-5 h-5" />
                          </Button>
                        </div>
                        <p>{post.qoute}</p>
                        <div className="flex items-center gap-4">
                          <Button variant="ghost" size="sm">
                            <MessageCircleIcon className="w-5 h-5" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <RepeatIcon className="w-5 h-5" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <HeartIcon className="w-5 h-5" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <UploadIcon className="w-5 h-5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })
            : null}
        </div>
      </div>
      <div className="bg-primary text-primary-foreground p-4 flex gap-4">
        <Avatar className="h-10 w-10">
          <AvatarImage src="/placeholder-user.jpg" />
          <AvatarFallback>AC</AvatarFallback>
        </Avatar>
        <Input placeholder="What's happening?" className="flex-1" />
        <Button>Tweet</Button>
      </div>
    </div>
  );
};

export default Home;
